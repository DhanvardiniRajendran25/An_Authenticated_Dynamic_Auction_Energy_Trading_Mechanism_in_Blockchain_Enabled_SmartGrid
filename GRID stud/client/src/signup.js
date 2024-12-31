import React, { Component, useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, Dropdown, Form,Spinner } from 'react-bootstrap';

import moment from "moment";
import "./App.css";

function Signup(props) {

  const [age, setage] = useState("")
  const [uname, setuname] = useState("")
  const [pass, setpass] = useState("")
  const [useradd, setuseradd] = useState("")
  const [reladd, setreladd] = useState("")
  const [bp, setbp] = useState("")
  const [heart_attack, setheart_attack] = useState("")
  const [diabetes_level, setdiabetes_level] = useState("")
  const [gender, setgender] = useState("")
  const [oxidation, setoxidation] = useState("")
  const [cancer, setcancer] = useState("")
  const [covid, setcovid] = useState("")
  const [updated_date, setupdated_date] = useState(moment().format("YYYYMMDD"))

  const [storageValue, setstorageValue] = useState(0)
  const [web3, setweb3] = useState(null)
  const [accounts, setaccounts] = useState(null)
  const [accountdetails, setaccountdetails] = useState(null)
  const [contract, setcontract] = useState(null)
  const [flag, setflag] = useState(0)
  const [option, setoption] = useState(localStorage.getItem("option2"))
  const [screenlogic,  setscreenlogic] = useState(0)

  useEffect(() => {
    // console.log("mount");


    load_data()




  }, [flag])

  const load_data = (async () => {

    try {
      // console.log("try signin");
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      //  console.log(accounts);
      setaccountdetails(accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );


      setweb3(instance)
      setaccounts(instance)
      setcontract(instance)
      setoption(localStorage.getItem("option2"))
     
    } catch (error) {
      alert(
        `Failed to load web3, accoun        deployedNetwork && deployedNetwork.address,
      ts, or contract. Check console for details.`,
      );
      console.error(error);
    }



  })



  let runExample = async (useradd,  uname, pass) => {
   
    try {

 
      let response = ""

     
      if ( option== "seller") {
   
        response = await contract.methods.signup_sellers(useradd, uname, pass).send({ from: accountdetails[0] })
       if(response!=null){
         setscreenlogic(0)
        alert("Account created successfully")
        window.location.reload()
       }

      }
      else if (option == "buyer") {
    
        response = await contract.methods.signup_buyer(useradd, uname, pass).send({ from: accountdetails[0] })
        if(response!=null){
          setscreenlogic(0)
        alert("Account created successfully")
        window.location.reload()
       }
      }
     
   


    } catch (error) {
      setscreenlogic(0)
      if (error.code == 4001) {

        alert(error.message)
       

        
      }
      else {
     
        alert("Enter valid details")
        window.location.reload()
      
      }

    
    }



  };
if(screenlogic==1){
  return(
    <>
    <Spinner animation="border" role="status" variant="success" className="position-absolute bottom-50 start-50">
 
</Spinner>
 <h1 style={{marginTop:"27%"}} className="text-success text-center">Loading... Please wait</h1>
 </>
  )
}
  return (

    // <div className="auth-wrapper" style={{
    //   backgroundImage: 'linear-gradient(to right, #f7f2f2, #ede8e8',
    //   backgroundPosition: 'center',
    //   backgroundSize: 'cover',
    //   backgroundRepeat: 'no-repeat',
    //   width: '100vw',
    //   height: '100vh'
    // }}>


  
      <div style={{display:'flex',alignItems:'center'}} >

        <Container className="border border-5 border-success" style={{marginTop:"5%"}}>

          <Row style={{ marginTop: 40, marginLeft: 40, marginRight: 80, marginBottom: 80, }}>
            <p className="fs-3">Selected option : {localStorage.getItem("option2")}</p>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label className="fs-5">User name</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setuname(e.target.value)
                    }}
                    value={uname} type="text" placeholder="Enter username" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label className="fs-5">Password</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setpass(e.target.value)
                    }}
                    value={pass} type="password" placeholder="Password" />
                </Form.Group>

              
              </Row>
              <Row className="mb-3">
             
                
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label className="fs-5">Owner address</Form.Label>
                  <Form.Control onChange={(e) => {
                    setuseradd(e.target.value)
                  }}
                    value={useradd} type="text" placeholder="Enter owner address" />
                </Form.Group>

              
              </Row>


              <div style={{ marginTop: 18 }}>
                <Button onClick={(e) => {
                  e.preventDefault()


                  runExample(useradd,uname, pass)
                  setscreenlogic(1)
                }} variant="outline-success" type="button">
                  Sign-up
                </Button>
                <Button style={{ marginLeft: 18 }} onClick={(e) => {
                  props.history.push({
                    pathname: '/',
                  })
                  window.location.reload()



                }} variant="outline-success" type="button">
                  Login
                </Button>
              </div>
            </Form>
          </Row>

        </Container>
      </div>
  
            

  );
}


export default Signup;

import React, { Component, useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, Dropdown, Form, Spinner } from 'react-bootstrap';
import { Router, Route, Switch, BrowserRouter } from "react-router-dom";
import backgroundImage from "./test2.jpg";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import "./App.css";

// let attendance_in_hour=localStorage.getItem("localusername")
// localStorage.setItem('localusername',buttonval );


function Login(props) {

  const [initial_option, setinitial_option] = useState("select")
  const [initial_uname, setinitial_uname] = useState("")
  const [initial_pass, setinitial_pass] = useState("")

  const [seller_name, setseller_name] = useState("")
  const [product_name, setproduct_name] = useState("")
  const [active, setactive] = useState(true)
  const [mcpprice, setmcpprice] = useState(0)

  const [bidprice, setbidprice] = useState("")
  const [seller_closing, setseller_closing] = useState("")


  const [web3, setweb3] = useState(null)
  const [accounts, setaccounts] = useState(null)
  const [contract, setcontract] = useState(null)
  const [flag, setflag] = useState(0)
  const [event, setevent] = useState("login")

  const [screenlogic, setscreenlogic] = useState(0)
  const [accountdetails, setaccountdetails] = useState(null)

  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const [data, setdata] = useState("")
  const [new_data, setnew_data] = useState({
    add: "",
    sname: "",
    pname: "",
    act: "",
    mcp: "",
    buyer_bid: [""],
    qty: [""],
    bidders_ids: [""],
    no_bids: 0,
    accepted: [""],
    rejected: [""],
    final_acc:[""],
    sell_rej:[""],
    pro_closed:false
  })
  const [buy_data, setbuy_data] = useState("")

  const [selleradd, setselleradd] = useState("")
  const [eth, seteth] = useState("")


  let array = []
  let buyer_bid_array = []
  let bidders_id = []
  let amountp=""
  let amountr=""

  useEffect(() => {
    // console.log("mount");

    load_data()


  }, [flag])


  const load_data = (async () => {

    try {
      // console.log("try");
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      setaccountdetails(accounts)

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      setweb3(instance)
      setaccounts(instance)
      setcontract(instance)
      // console.log(instance);
      // runExample(instance)
      // console.log(contract);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accoun deployedNetwork && deployedNetwork.address,
ts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  })


  const startPayment = async ({ setError, setTxs, ether, addr }) => {
   
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
       
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      console.log({ ether, addr });
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ether.toFixed(0))
      });
    
      console.log("tx", tx);
      setTxs([tx]);
    
      setevent("viewbuyer")
    } catch (err) {
      setError(err.message);
    }
  };

  const startPayment2 = async ({ setError, setTxs, ether, addr }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
       
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ether.toFixed(0))
      });
      console.log({ ether, addr });
      console.log("tx", tx);
      setTxs([tx]);
    
      setevent("viewseller2")
    } catch (err) {
      setError(err.message);
    }
  };




  let runExample = async (username, password) => {
    try {

      let response = ""


      if (initial_option == "seller") {
     
        response = await contract.methods.seller_login_validate(username, password).call()
        if (Number(response)) {
          localStorage.setItem('localusername', username);

 try {
          let response2 = ""
      response2 = await contract.methods.view_products_buyers().call()


          JSON.parse(response2)
          setdata(JSON.parse(response2))
    
          console.log(data);
    
          let display = JSON.parse(response2)
          function filt(age) {
            return age.add == localStorage.getItem("localusername")
          }
          let filter = display.filter(filt)
    
          setnew_data(filter)
    
          console.log(filter);
         
        }
        catch (error) {
          setnew_data(null)
          setdata(null)
        }


          setevent("viewseller2")

        }
        else {
          alert("Invalid username password")
          window.location.reload()
        }

      }
      else if (initial_option == "buyer") {
        response = await contract.methods.buyer_login_validate(username, password).call()
        if (Number(response)) {
          localStorage.setItem('localusername', username);
          response = await contract.methods.view_products_buyers().call()

          setbuy_data(JSON.parse(response))
          setevent("viewbuyer")

        }
        else {
          alert("Invalid username password")
          window.location.reload()
        }
      }
      else if (initial_option == "admin") {

        if (username=="admin" && password=="123") {
   
          setevent("admin")

        }
        else {
          alert("Invalid username password")
          window.location.reload()
        }
      }


    } catch (error) {
      alert("SELLER MUST ADD PRODUCTS")
      window.location.reload()
    }

  };

  const handleSubmit = async (e) => {
console.log(eth,selleradd);
    e.preventDefault();
  
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: eth,
      addr: selleradd
    });
  };

  const handleSubmit2 = async (e) => {
    console.log(eth,selleradd);
        e.preventDefault();
      
        setError();
        await startPayment2({
          setError,
          setTxs,
          ether: eth,
          addr: selleradd
        });
      };

  let seller_data = async () => {

    try {

      let response2 = ""
      response2 = await contract.methods.view_products_buyers().call()
      JSON.parse(response2)
      setdata(JSON.parse(response2))

      console.log(data);

      let display = JSON.parse(response2)
      function filt(age) {
        return age.add == localStorage.getItem("localusername")
      }
      let filter = display.filter(filt)

      setnew_data(filter)

      console.log(filter);





      setevent("viewseller2")


    } catch (error) {
      alert("ADD PRODUCTS")

    }
  }

  let storage = async (add, sname, pname, act, mcp) => {
    try {
      let object = {
        add: add,
        sname: sname,
        pname: pname,
        act: act,
        mcp: mcp,
        buyer_bid: [],
        qty: [],
        bidders_ids: [],
        no_bids: 0,
        accepted: [],
        rejected: [],
        final_acc:[],
        sell_rej:[],
        pro_closed:false
      }
      array.push(object)

      let data = JSON.stringify(array);
      console.log(data);

      await contract.methods.update_products(data).send({ from: accountdetails[0] })
      alert("SUCCESSFULLY UPDATED")

      setscreenlogic(0)

      let response2 = ""
      response2 = await contract.methods.view_products_buyers().call()


          JSON.parse(response2)
          setdata(JSON.parse(response2))
    
          console.log(data);
    
          let display = JSON.parse(response2)
          function filt(age) {
            return age.add == localStorage.getItem("localusername")
          }
          let filter = display.filter(filt)
    
          setnew_data(filter)
    
          console.log(filter);
      setevent("viewseller2")

    }
    catch (error) {
      setscreenlogic(0)
      alert("Something went worng")

    }
  }

  let update = async (value) => {
    try {
      console.log(value);
      await contract.methods.update_products(value).send({ from: accountdetails[0] })
      alert("SUCCESSFULLY UPDATED")

      setscreenlogic(0)
      setevent("viewseller2")

    }
    catch (error) {
      setscreenlogic(0)
      alert("Something went worng")

    }
  }
  let update2 = async (value) => {
    try {
      console.log(value);
      await contract.methods.update_products(value).send({ from: accountdetails[0] })
      alert("SUCCESSFULLY UPDATED")

      setscreenlogic(0)
     let response = await contract.methods.view_products_buyers().call()

      setbuy_data(JSON.parse(response))
      setevent("viewbuyer")

    }
    catch (error) {
      setscreenlogic(0)
      alert("Something went worng")

    }
  }

  let updatep = async (value) => {
    try {
      console.log(value);
      await contract.methods.update_products(value).send({ from: accountdetails[0] })
      alert("SUCCESSFULLY UPDATED")

      setscreenlogic(0)
     let response = await contract.methods.view_products_buyers().call()

      setbuy_data(JSON.parse(response))
    

    }
    catch (error) {
      setscreenlogic(0)
      alert("Something went worng")
      setevent("viewbuyer")

    }
  }

  let update4 = async (value) => {
    try {
      console.log(value);
      await contract.methods.update_products(value).send({ from: accountdetails[0] })
      alert("SUCCESSFULLY UPDATED")

      setscreenlogic(0)
      let response2 = ""
      response2 = await contract.methods.view_products_buyers().call()


          JSON.parse(response2)
          setdata(JSON.parse(response2))
    
          console.log(data);
    
          let display = JSON.parse(response2)
          function filt(age) {
            return age.add == localStorage.getItem("localusername")
          }
          let filter = display.filter(filt)
    
          setnew_data(filter)
    
          console.log(filter);
      setevent("viewseller2")

    }
    catch (error) {
      setscreenlogic(0)
      alert("Something went worng")

    }
  }

  let update5 = async (value) => {
    try {
      console.log(value);
      await contract.methods.update_products(value).send({ from: accountdetails[0] })
      alert("SUCCESSFULLY UPDATED")

      setscreenlogic(0)
      let response2 = ""
      response2 = await contract.methods.view_products_buyers().call()


          JSON.parse(response2)
          setdata(JSON.parse(response2))
    
          console.log(data);
    
          let display = JSON.parse(response2)
          function filt(age) {
            return age.add == localStorage.getItem("localusername")
          }
          let filter = display.filter(filt)
    
          setnew_data(filter)
    
      

    }
    catch (error) {
      setscreenlogic(0)
      alert("Something went worng")

    }
  }

  if (screenlogic == 1) {
    return (
      <>
        <Spinner animation="border" role="status" variant="success" className="position-absolute bottom-50 start-50">
        </Spinner>
        <h1 style={{ marginTop: "27%" }} className="text-success text-center">Updating... Please wait</h1>
      </>
    )
  }

  return (
    <>
      {
        event == "login" ? (
          <div className="auth-wrapper" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            width: '100vw',
            height: '100vh'
          }}>

            <Container >

              <Row>
                <Col >
                  <Card style={{ width: '25rem', height: '23rem' }} border="success" className=" p-4 position-absolute top-50 start-50 translate-middle">

                    <p className="fs-1 text-center">LOGIN</p>
                    <Form.Group className="mb-3" controlId="formGridState">

                      <Form.Select defaultValue={initial_option}
                        onChange={(event) => {

                          setinitial_option(event.target.value);
                          setinitial_uname("")
                          setinitial_pass("")

                        }}>

                        <option value="select">-Select-</option>
                        <option value="admin">SUPER ADMIN</option>
                        <option value="seller" >SELLER</option>
                        <option value="buyer">BUYER</option>

                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasic">

                      <Form.Control onChange={(event) => {
                        setinitial_uname(event.target.value);

                      }} value={initial_uname} type="text" placeholder="Enter User address" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">

                      <Form.Control onChange={(event) => {
                        setinitial_pass(event.target.value);

                      }} value={initial_pass} type="password" placeholder="Enter Password" />
                    </Form.Group>

                    <Button onClick={() => {
                      localStorage.setItem('option', initial_option);
                      runExample(initial_uname, initial_pass)

                    }

                    } variant="outline-success" className="d-grid gap-2 ">LOGIN</Button>
                 

                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        ) :
          
            event == "viewseller2" ? (
              <>
                <Button onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }

                }
                  style={{ marginTop: 30, marginLeft: "90%" }}
                  variant="outline-success" >LOG OUT</Button>
                <div style={{ display: 'flex', alignItems: 'center' }} >

                  <Container className="border border-5 border-success" style={{ marginTop: "5%" }}>

                    <Row style={{ marginTop: 40, marginLeft: 40, marginRight: 80, marginBottom: 80, }}>
                      <p className="fs-3">Selected option : {localStorage.getItem("option")}</p>
                      <Form>
                        <Row className="mb-3">
                          <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label className="fs-5">Product name</Form.Label>
                            <Form.Control
                              onChange={(e) => {
                                setseller_name(e.target.value)
                              }}
                              value={seller_name} type="text" placeholder="Enter product name" />
                          </Form.Group>

                          <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label className="fs-5">Quantity</Form.Label>
                            <Form.Control
                              onChange={(e) => {
                                setproduct_name(e.target.value)
                              }}
                              value={product_name} type="text" placeholder="Enter quantity" />
                          </Form.Group>




                        </Row>



                        <div style={{ marginTop: 18 }}>
                          <Button onClick={(e) => {
                            e.preventDefault()

                            if(data==null){

                            }
                            else{
                                 data.map((ele) => {
                              array.push(ele)
                            })
                            }
                           

                            storage(localStorage.getItem("localusername"), seller_name, product_name, active, mcpprice)
                            setscreenlogic(1)


                          }} variant="outline-success" type="button">
                            ADD PRODUCT
                          </Button>

                        </div>
                      </Form>
                    </Row>

                  </Container>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }} >

                  <Container className="border border-5 border-success" style={{ marginTop: "5%", marginBottom: "5%" }}>

                    <Row style={{ marginTop: 40, marginLeft: 40, marginRight: 40, marginBottom: 80 }}>
                      <div style={{ marginTop: 20 }}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>

                              <th scope="col">Product name</th>
                              <th scope="col">Quantity</th>
                              <th scope="col">MCP</th>
                              <th scope="col">Bidding Status</th>
                              <th scope="col" style={{paddingLeft:"150px"}}>Bidders  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Qty&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Result&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status</th>

                            </tr>
                          </thead>
                          { new_data != null ?(
    new_data.map((ele) => (

      <tbody>

        <tr>

          <td ><h6>{ele.sname}</h6></td>
          <td ><h6>{ele.pname}</h6></td>
          {
            ele.act == false ? (
              <td ><h6>{ele.mcp}</h6></td>

            ) : (
              <td ><h6>0</h6></td>
            )
          }
          <td ><Button
            value={localStorage.getItem("localusername") + "+" + ele.sname + "+" + ele.pname + "+" + ele.act + "+" + ele.mcp}
            disabled={!ele.act}

            onClick={(ele) => {
              let split = ele.target.value.split("+")
              console.log(data, "top");
              data.map((val, i) => {

                if (split[0] == val.add && split[1] == val.sname && split[2] == val.pname && split[3] == "true" && split[4] == val.mcp) {

                  let top = 0
                  let bot = 0
                  val.buyer_bid.map((ele) => {
                    top = top + Number(ele)
                  })
                  val.qty.map((ele) => {
                    bot = bot + Number(ele)
                  })
                  let avg = (top / bot)
                  avg = avg.toFixed(4)
                  console.log(avg);
                  if (avg == "NaN") {
                    avg = 0
                  }

                  let new_object = {
                    add: val.add,
                    sname: val.sname,
                    pname: val.pname,
                    act: false,
                    mcp: avg,
                    buyer_bid: val.buyer_bid,
                    qty: val.qty,
                    bidders_ids: val.bidders_ids,
                    no_bids: val.buyer_bid.length,
                    accepted: val.accepted,
                    rejected: val.rejected,
                    final_acc:val.final_acc,
                    sell_rej:val.sell_rej,
                    pro_closed:val.pro_closed
                  }
                  array.push(new_object)

                }
                else {
                  array.push(val)
                }

              })
              setdata(array)
              function filt(age) {
                return age.add == localStorage.getItem("localusername")
              }
              let filter = array.filter(filt)

              setnew_data(filter)
              console.log(filter);
            }}

          >CLOSE</Button></td>

{
            ele.act == false ? (

          ele.bidders_ids.map((dat,i)=>(
            <table>
<tr>
  <td style={{width:200}}>{dat}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </td> 
  <td style={{width:50,fontWeight:"bold"}}> {ele.qty[i]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; </td> 

  {
           ele.accepted.includes(dat) ? (
            <td style={{width:80}}><Button
  disabled={(ele.final_acc.includes(dat) ||  ele.sell_rej.includes(dat) ? true : false)}
className={(ele.final_acc.includes(dat) ? "btn btn-success" : "btn btn-primary")}
  value={ele.add + "+" + ele.sname + "+" + ele.pname+ "+" +dat+"+"+i }


  
  onClick={(ele) => {
    let split = ele.target.value.split("+")
    console.log( ele.target);
    let value3=split[3]
    let index=split[4]

    let sel_acc = []
    sel_acc.push(value3)
    data.map((val, i) => {

      if (split[0] == val.add && split[1] == val.sname && split[2] == val.pname ) {
        console.log(split[0],val.add,split[1], val.sname,split[2],val.pname,value3,"fhgsdhf" );

        console.log(val.qty[index]);
        val.pname=Number(val.pname)-val.qty[index]
        val.final_acc.map((ele) => {
          sel_acc.push(ele)
        })
console.log(sel_acc);

        let new_object = {
          add: val.add,
          sname: val.sname,
          pname: val.pname,
          act: val.act,
          mcp: val.mcp,
          buyer_bid: val.buyer_bid,
          qty: val.qty,
          bidders_ids: val.bidders_ids,
          no_bids: val.buyer_bid.length,
          accepted: val.accepted,
          rejected: val.rejected,
          final_acc:sel_acc,
          sell_rej:val.sell_rej,
          pro_closed:true
        }
        array.push(new_object)

      }
      else {
        array.push(val)
      }

    })
    
    update4(JSON.stringify(array))
    setscreenlogic(1)
    console.log(array);
  }}


  >Accept</Button> </td> 

            ) : (
          null
            )
          }  

{
           (ele.accepted.includes(dat) && ele.final_acc.includes(dat) ) ? (
            <td style={{width:50}}><Button 
            disabled={true}
            >Reject</Button> </td> 

            ) :


            ele.accepted.includes(dat) ? (
              <td style={{width:50}}><Button 
              disabled={ele.sell_rej.includes(dat)? true : false }
  value={ele.add + "+" + ele.sname + "+" + ele.pname+ "+" +dat }



  onClick={(ele) => {
    let split = ele.target.value.split("+")
    console.log( ele.target);
    let value3=split[3]

    let sel_rej = []
    sel_rej.push(value3)
    // let indee =ele.bidders_ids.indexOf(value3)
    console.log(value3);
    // amountp=ele.qty[indee]*ele.mcp
  // seteth(amountp);

    data.map((val, i) => {
      


      if (split[0] == val.add && split[1] == val.sname && split[2] == val.pname ) {
        console.log(split[0],val.add,split[1], val.sname,split[2],val.pname,value3,"dfkgsdh" );
    let indee =val.bidders_ids.indexOf(value3)
    console.log(value3);
console.log(val.bidders_ids.indexOf(value3));
    amountp=val.qty[indee]*val.mcp
  seteth(amountp);

        val.sell_rej.map((ele) => {
          sel_rej.push(ele)
        })

console.log(sel_rej,"fsdf");


        let new_object = {
          add: val.add,
          sname: val.sname,
          pname: val.pname,
          act: val.act,
          mcp: val.mcp,
          buyer_bid: val.buyer_bid,
          qty: val.qty,
          bidders_ids: val.bidders_ids,
          no_bids: val.buyer_bid.length,
          accepted: val.accepted,
          rejected: val.rejected,
          final_acc:val.final_acc,
          sell_rej:sel_rej,
          pro_closed:val.pro_closed
        }
        array.push(new_object)

      }
      else {
        array.push(val)
      }

    })
    setselleradd(value3)
    update5(JSON.stringify(array))
    setscreenlogic(1)
    setevent("payment2")
    console.log(array);
  }}

            
              >Reject</Button> </td> 
  
              ):
            
            (
      null
            )
          } 


  
    {
      ele.accepted.includes(dat) ?(
<td> &nbsp;&nbsp;&nbsp;&nbsp;Accepted&nbsp;&nbsp;&nbsp;&nbsp;</td>
      ):
      ele.rejected.includes(dat) ?(
        <td style={{paddingLeft:155}}>&nbsp;&nbsp;Rejected&nbsp;&nbsp;&nbsp;&nbsp;</td>
        
      ):
      
      (
     null
      )
    }
    
    
  
</tr>

            </table>
          ))

            ) : (
          null
            )
          }

        </tr>

      </tbody>
    ))

                          )
                          
                          
                          :(null)                        

                          }


                        </table>
                        <Button onClick={() => {
                          console.log(data);
                          update(JSON.stringify(data))
                          setscreenlogic(1)


                        }

                        }
                          style={{ marginTop: 30 }}
                          variant="outline-success" >Save</Button>
                      </div>
                    </Row>

                  </Container>
                </div>

              </>
            ) :
              event == "viewbuyer" ? (
                <>

                  <Button onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }

                  }
                    style={{ marginTop: 30, marginLeft: "90%" }}
                    variant="outline-success" >LOG OUT</Button>

                  <div style={{ marginTop: 20}}>
                  <Container>
                  <Row>

                    {
                      buy_data.map((val) => (

                        <Col sm={3}>

                        <Card style={{ width: '18rem' ,height: "16rem", marginTop:15}}>
                          <Card.Body>
                            <Card.Title className="text-center">{val.pname}</Card.Title>
                            <Card.Text className="text-center">
                              {val.sname}
                            </Card.Text>
                            {
                              val.act == false ? (
                                <Card.Text className="text-center">Bidding is closed</Card.Text>

                              ) : (
                                <Button
                                style={{marginLeft:75, width:100}}
                                disabled={(val.bidders_ids.includes(localStorage.getItem("localusername")) || val.act == false ? true : false)}
                                value={val.add + "+" + val.sname + "+" + val.pname + "+" + val.buyer_bid + "+" + val.bidders_ids}
                                onClick={(ele) => {
                                  console.log(ele.target);
                                  let buyer_bid_array = []
                                  let buyer_qty_array = []
                                  let bidders_id = []
  
                                  let BP = (prompt('Enter price per quantity'))
                                  let QTY = (prompt('Enter quantity'))
                                  setbidprice(BP)
                                  let split = ele.target.value.split("+")
                                  let tot = BP * QTY
                                  buyer_bid_array.push(tot)
                                  buyer_qty_array.push(QTY)
  
                                  bidders_id.push(localStorage.getItem("localusername"))
  
  
                                  buy_data.map((val, i) => {
  
  
  
                                    if (split[0] == val.add && split[1] == val.sname && split[2] == val.pname) {
  
  
                                      val.buyer_bid.map((ele) => {
                                        buyer_bid_array.push(ele)
                                      })
                                      val.qty.map((ele) => {
                                        buyer_qty_array.push(ele)
                                      })
  
                                      val.bidders_ids.map((ele) => {
                                        bidders_id.push(ele)
                                      })
  
                                      let new_object = {
                                        add: val.add,
                                        sname: val.sname,
                                        pname: val.pname,
                                        act: val.act,
                                        mcp: val.mcp,
                                        buyer_bid: buyer_bid_array,
                                        qty: buyer_qty_array,
                                        bidders_ids: bidders_id,
                                        no_bids: val.no_bids,
                                        accepted: val.accepted,
                                        rejected: val.rejected,
                                        final_acc:val.final_acc,
                                        sell_rej:val.sell_rej,
                                        pro_closed:val.pro_closed
  
                                      }
                                      array.push(new_object)
  
                                    }
                                    else {
                                      array.push(val)
                                    }
  
                                  })
  
                                  update2(JSON.stringify(array))
                                  setscreenlogic(1)
  
                                }}
  
                              >BID</Button>
                              )
                            }
                         

                            {
                              val.act == false ? (
                                <Card.Text className="text-center" >MCP {val.mcp} </Card.Text>

                              ) : (
                                <Card.Text className="text-center"    style={{marginTop:30,}}>MCP - 0</Card.Text>
                              )
                            }


                            {
                              val.bidders_ids.includes(localStorage.getItem("localusername")) && val.final_acc.includes(localStorage.getItem("localusername"))  ? (
                                <Card.Text className="text-center text-success" >BIDDING SUCCESSFUL!</Card.Text>

                              ) :
                              val.bidders_ids.includes(localStorage.getItem("localusername")) && val.sell_rej.includes(localStorage.getItem("localusername"))  ? (
                                <Card.Text className="text-center text-danger" >BIDDING UNSUCCESSFUL!</Card.Text>

                              ):
                              val.bidders_ids.includes(localStorage.getItem("localusername")) && val.rejected.includes(localStorage.getItem("localusername"))  ? (
                                <Card.Text className="text-center text-danger" >BIDDING UNSUCCESSFUL!</Card.Text>

                              ):
                              (
                               null
                              )
                            }


                            {
                              val.act == false && val.bidders_ids.includes(localStorage.getItem("localusername"))  ? (


                                <Button
                                style={{marginLeft:30, width:80}}
                                  disabled={(val.accepted.includes(localStorage.getItem("localusername")) || val.rejected.includes(localStorage.getItem("localusername")) ? true : false)}
                                  value={val.add + "+" + val.sname + "+" + val.pname + "+" + val.buyer_bid + "+" + val.bidders_ids}


                                  onClick={(ele) => {
                                    let split = ele.target.value.split("+")
                                    let acc = []
                                  
                                    acc.push(localStorage.getItem("localusername"))
                                    console.log(val.bidders_ids);
                                    let indee =val.bidders_ids.indexOf(localStorage.getItem("localusername"))
                                    amountp=val.qty[indee]*val.mcp
  seteth(amountp);
                                 
                                    buy_data.map((val, i) => {
                                     

                                      if (split[0] == val.add && split[1] == val.sname && split[2] == val.pname) {

                                  
                                   



                                        val.accepted.map((ele) => {
                                          acc.push(ele)
                                        })



                                        let new_object = {
                                          add: val.add,
                                          sname: val.sname,
                                          pname: val.pname,
                                          act: val.act,
                                          mcp: val.mcp,
                                          buyer_bid: val.buyer_bid,
                                          qty: val.qty,
                                          bidders_ids: val.bidders_ids,
                                          no_bids: val.no_bids,
                                          accepted: acc,
                                          rejected: val.rejected,
                                          final_acc:val.final_acc,
                                          sell_rej:val.sell_rej,
                                          pro_closed:val.pro_closed

                                        }
                                        array.push(new_object)

                                      }
                                      else {
                                        array.push(val)
                                      }

                                    })
                                    setselleradd(val.add)
                                    updatep(JSON.stringify(array))
                                    setscreenlogic(1)
                                    setevent("payment")

                                  }}
                                >Accept</Button>
                              ) : (
                                null
                              )
                            }


                            {
                              val.act == false && val.bidders_ids.includes(localStorage.getItem("localusername")) ? (
                                <Button
                                style={{marginLeft:30, width:80}}
                                  disabled={(val.accepted.includes(localStorage.getItem("localusername")) || val.rejected.includes(localStorage.getItem("localusername")) ? true : false)}
                                  value={val.add + "+" + val.sname + "+" + val.pname + "+" + val.buyer_bid + "+" + val.bidders_ids}

                                  onClick={(ele) => {
                                    let split = ele.target.value.split("+")

                                    let rej = []
                                    rej.push(localStorage.getItem("localusername"))

                                    buy_data.map((val, i) => {



                                      if (split[0] == val.add && split[1] == val.sname && split[2] == val.pname) {


                                        val.rejected.map((ele) => {
                                          rej.push(ele)
                                        })



                                        let new_object = {
                                          add: val.add,
                                          sname: val.sname,
                                          pname: val.pname,
                                          act: val.act,
                                          mcp: val.mcp,
                                          buyer_bid: val.buyer_bid,
                                          qty: val.qty,
                                          bidders_ids: val.bidders_ids,
                                          no_bids: val.no_bids,
                                          accepted: val.accepted,
                                          rejected: rej,
                                          final_acc:val.final_acc,
                                          sell_rej:val.sell_rej,
                                          pro_closed:val.pro_closed

                                        }
                                        array.push(new_object)

                                      }
                                      else {
                                        array.push(val)
                                      }

                                    })

                                    update2(JSON.stringify(array))
                                    setscreenlogic(1)

                                  }}
                                >Reject</Button>
                              ) : (
                                null
                              )
                            }



                          </Card.Body>
                        </Card>
                        </Col>



                      ))
                    }
                    </Row>

                    </Container>
                  </div>

                </>

              ) :
               
          event == "admin" ? (
            <>
        

<div style={{ display: "flex", justifyContent: "space-around", marginTop: "20%" }} >
<div>

  <Button onClick={(e) => {
    e.preventDefault()

    props.history.push({
      pathname: '/signup',

    })
    
    window.location.reload()
    localStorage.setItem('option2', "seller");

  }} variant="outline-success" type="button"
    style={{ width: 150, height: 150 }}>

  CREATE SELLER 
  </Button>
</div>


<div>
  <Button onClick={(e) => {
    e.preventDefault()

    props.history.push({
      pathname: '/signup',
    
    })
    window.location.reload()
    localStorage.setItem('option2', "buyer");
  }} variant="outline-success" type="button"
    style={{ width: 150, height: 150 }}>
   CREATE BUYER
  </Button>
</div>



</div>

            </>
          ) :
              event=="payment"?(
                <>
                <form className="m-4" >
      <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Send ETH payment
          </h1>
     
            <div className="my-3">
            <Form.Group className="mb-3" controlId="formBasic">

<Form.Control onChange={(event) => {
  setselleradd(event.target.value);

}} value={selleradd} type="text" placeholder="User name" />
</Form.Group>
<Form.Group className="mb-3" controlId="formBasicPassword">

<Form.Control onChange={(event) => {
  // seteth(amountp);

}} value={eth} type="text" placeholder="Amount" />
</Form.Group>
          </div>
        </main>
        <footer className="p-4">
          <button
          onClick={handleSubmit}
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Pay now
          </button>
          <ErrorMessage message={error} />
          <TxList txs={txs} />
        </footer>
      </div>
    </form>
               </>
             

              ):
              event=="payment2"?(
                <>
                <form className="m-4" >
      <div className="credit-card w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Send ETH payment
          </h1>
     
            <div className="my-3">
            <Form.Group className="mb-3" controlId="formBasic">

<Form.Control onChange={(event) => {
  setselleradd(event.target.value);

}} value={selleradd} type="text" placeholder="User name" />
</Form.Group>
<Form.Group className="mb-3" controlId="formBasicPassword">

<Form.Control onChange={(event) => {
  // seteth(amountr);

}} value={eth} type="text" placeholder="Amount" />
</Form.Group>
          </div>
        </main>
        <footer className="p-4">
          <button
          onClick={handleSubmit2}
            className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
          >
            Pay now
          </button>
          <ErrorMessage message={error} />
          <TxList txs={txs} />
        </footer>
      </div>
    </form>
               </>
             

              )
              :

                (
                  null
                )
      }

    </>




  );
}

export default Login;








import React, { Component, useState, useEffect } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, Dropdown, Form, Spinner } from 'react-bootstrap';
import { Router, Route, Switch, BrowserRouter } from "react-router-dom";
import backgroundImage from "./test2.jpg";

// let attendance_in_hour=localStorage.getItem("localusername")
// localStorage.setItem('localusername',buttonval );

import "./App.css";

function Login(props) {

const [initial_option, setinitial_option] = useState("seller")
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



const [data, setdata] = useState("")
const [new_data, setnew_data] = useState("")
const [buy_data, setbuy_data] = useState("")
let array=[]
let buyer_bid_array=[]
let bidders_id=[]

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

let runExample = async (username, password) => {
try {

let response = ""


if (initial_option == "seller") {
response = await contract.methods.seller_login_validate(username, password).call()
if (Number(response)) {
localStorage.setItem('localusername',username );





setevent("viewseller")

}
else {
alert("Invalid username password")
window.location.reload()
}

}
else if (initial_option == "buyer") {
response = await contract.methods.buyer_login_validate(username, password).call()
if (Number(response)) {
  localStorage.setItem('localusername',username );
  response = await contract.methods.view_products_buyers().call()

setbuy_data(JSON.parse(response))
setevent("viewbuyer")

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

let seller_data= async()=>{

  try {
    
  let response2 = ""
response2 = await contract.methods.view_products_buyers().call()
JSON.parse(response2)
setdata(JSON.parse(response2))

console.log(data);

let display=JSON.parse(response2)
function filt(age) {
return age.add == localStorage.getItem("localusername")
}
let filter= display.filter(filt)

setnew_data(filter)

console.log(filter);





setevent("viewseller2")


} catch (error) {
  alert("ADD PRODUCTS")
 
  }
} 

let storage= async (add,sname,pname,act,mcp)=>{
  try{
    let object={
      add:add,
      sname:sname,
      pname:pname,
      act:act,
      mcp:mcp,
      buyer_bid:[],
      bidders_ids:[],
      no_bids:0,
      accepted:[],
      rejected:[],
    }
    array.push(object)
   
    let data=JSON.stringify(array);
    console.log(data);

    await contract.methods.update_products(data).send({ from: accountdetails[0] })
    alert("SUCCESSFULLY UPDATED")
    
    setscreenlogic(0)
    setevent("viewseller")
    
    }
    catch (error) {
    setscreenlogic(0)
    alert("Something went worng")
    
    }
}

let update= async (value)=>{
  try{
   console.log(value);
    await contract.methods.update_products(value).send({ from: accountdetails[0] })
    alert("SUCCESSFULLY UPDATED")
    
    setscreenlogic(0)
    setevent("viewseller")
    
    }
    catch (error) {
    setscreenlogic(0)
    alert("Something went worng")
    
    }
}
let update2= async (value)=>{
  try{
   console.log(value);
    await contract.methods.update_products(value).send({ from: accountdetails[0] })
    alert("SUCCESSFULLY UPDATED")
    
    setscreenlogic(0)

    
    }
    catch (error) {
    setscreenlogic(0)
    alert("Something went worng")
    
    }
}






if(screenlogic==1){
return(
<>
<Spinner animation="border" role="status" variant="success" className="position-absolute bottom-50 start-50">
</Spinner>
<h1 style={{marginTop:"27%"}} className="text-success text-center">Updating... Please wait</h1>
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

<option value="seller" >SELLER</option>
<option value="buyer">BUYER</option>

</Form.Select>
</Form.Group>
<Form.Group className="mb-3" controlId="formBasic">

<Form.Control onChange={(event) => {
setinitial_uname(event.target.value);

}} value={initial_uname} type="text" placeholder="User name" />
</Form.Group>
<Form.Group className="mb-3" controlId="formBasicPassword">

<Form.Control onChange={(event) => {
setinitial_pass(event.target.value);

}} value={initial_pass} type="password" placeholder="Password" />
</Form.Group>

<Button onClick={() => {
localStorage.setItem('option', initial_option);
runExample(initial_uname, initial_pass)

}

} variant="outline-success" className="d-grid gap-2 ">LOGIN</Button>
<Button onClick={() => {

localStorage.setItem('option', initial_option);
props.history.push({
pathname: '/signup',
option: initial_option,

})
window.location.reload()
}}
variant="link">New User?</Button>

</Card>
</Col>
</Row>
</Container>
</div>
) :
event == "viewseller" ? (
<>
<Button onClick={() => {
localStorage.clear();
window.location.reload();
}

}
style={{ marginTop: 30 ,marginLeft:"90%"}}
variant="outline-success" >LOG OUT</Button>
<div style={{display:'flex',alignItems:'center'}} >

        <Container className="border border-5 border-success" style={{marginTop:"5%"}}>

          <Row style={{ marginTop: 40, marginLeft: 40, marginRight: 80, marginBottom: 80, }}>
            <p className="fs-3">Selected option : {localStorage.getItem("option")}</p>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label className="fs-5">seller name</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setseller_name(e.target.value)
                    }}
                    value={seller_name} type="text" placeholder="Enter username" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label className="fs-5">product name</Form.Label>
                  <Form.Control
                    onChange={(e) => {
                      setproduct_name(e.target.value)
                    }}
                    value={product_name} type="text" placeholder="Enter username" />
                </Form.Group>
               

              
              
              </Row>
          


              <div style={{ marginTop: 18 }}>
                <Button onClick={(e) => {
                  
                  e.preventDefault()

              
                  
storage(localStorage.getItem("localusername"),seller_name,product_name,active,mcpprice)
                 
               
                }} variant="outline-success" type="button"
                
                >
                ADD PRODUCT
                </Button>
             
              </div>
            </Form>
          </Row>
          <Button onClick={(e) => {
                  e.preventDefault()
                  seller_data()

                }} variant="outline-success" type="button"
                style={{marginLeft: 42 }}
                >
               
             VIEW PRODUCTS
                </Button>
        </Container>
      </div>



</>
) :
event == "viewseller2" ? (
  <>
  <Button onClick={() => {
localStorage.clear();
window.location.reload();
}

}
style={{ marginTop: 30 ,marginLeft:"90%"}}
variant="outline-success" >LOG OUT</Button>
  <div style={{display:'flex',alignItems:'center'}} >
  
          <Container className="border border-5 border-success" style={{marginTop:"5%"}}>
  
            <Row style={{ marginTop: 40, marginLeft: 40, marginRight: 80, marginBottom: 80, }}>
              <p className="fs-3">Selected option : {localStorage.getItem("option")}</p>
              <Form>
                <Row className="mb-3">
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label className="fs-5">seller name</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        setseller_name(e.target.value)
                      }}
                      value={seller_name} type="text" placeholder="Enter username" />
                  </Form.Group>
  
                  <Form.Group as={Col} controlId="formGridEmail">
                    <Form.Label className="fs-5">product name</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        setproduct_name(e.target.value)
                      }}
                      value={product_name} type="text" placeholder="Enter username" />
                  </Form.Group>
                 
  
                
                
                </Row>
            
  
  
                <div style={{ marginTop: 18 }}>
                  <Button onClick={(e) => {
                    e.preventDefault()
  
                    data.map((ele)=>{
                     array.push(ele)
                    })
                    
  storage(localStorage.getItem("localusername"),seller_name,product_name,active,mcpprice)
                   
                 
                  }} variant="outline-success" type="button">
                  ADD PRODUCT
                  </Button>
               
                </div>
              </Form>
            </Row>
  
          </Container>
        </div>
  
        <div style={{display:'flex',alignItems:'center'}} >
  
          <Container className="border border-5 border-success" style={{marginTop:"5%"}}>
  
            <Row style={{ marginTop: 40, marginLeft: 40, marginRight: 80, marginBottom: 80, }}>
            <div style={{ marginTop: 20 }}>
  <table className="table table-striped">
  <thead>
  <tr>
  
  <th scope="col">Product name</th>
  <th scope="col">Active  </th>
  
  <th scope="col">MCP </th>
  <th scope="col">TOT Bids </th>
  
  </tr>
  </thead>
  {
  
  
  new_data.map((ele)=>(
   
      <tbody>
    
        <tr>
     
        <td ><h4>{ele.pname}</h4></td>
        <td ><Button 
      value={localStorage.getItem("localusername")+"+"+ele.sname+"+"+ele.pname+"+"+ele.act+"+"+ele.mcp}
    disabled={!ele.act}
      
        onClick={(ele)=>{
  let split=ele.target.value.split("+")
  console.log(data,"top");
  data.map((val,i)=>{
  
    if(split[0]==val.add && split[1]==val.sname && split[2]==val.pname && split[3]=="true" && split[4]==val.mcp ){
  let MCP=0
      val.buyer_bid.map((ele)=>{
       MCP=MCP+Number(ele)
      })
      let avg=MCP/ val.buyer_bid.length
      console.log(avg);
      // if(avg !=Number){
      //   avg=0
      // }
  
      let new_object={
        add:val.add,
        sname:val.sname,
        pname:val.pname,
        act:false,
        mcp:avg,
        buyer_bid:val.buyer_bid,
        bidders_ids:val.bidders_ids,
        no_bids:val.buyer_bid.length,
        accepted:val.accepted,
        rejected:val.rejected,
      }
      array.push(new_object)
  
    }
    else{
      array.push(val)
    }
   
  })
  setdata(array)
  function filt(age) {
    return age.add == localStorage.getItem("localusername")
    }
    let filter= array.filter(filt)
    
    setnew_data(filter)
  console.log(filter);
        }}
        
        >CLOSE</Button></td>
  
      {
        ele.act== false ?(
  <td ><h4>{ele.mcp}</h4></td> 
  
        ):(
          <td ><h4>0</h4></td> 
        )
      }
          {
        ele.act== false ?(
  <td ><h4>{ele.no_bids}</h4></td>
  
        ):(
          <td ><h4>0</h4></td>
        )
      }
  
        
  
  
        </tr>
       
        </tbody> 
  ))
      
  }
  
  
  
    
  
  
  </table>
  <Button onClick={() => {
  console.log(data);
  update(JSON.stringify(data))
  
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
style={{ marginTop: 30 }}
variant="outline-success" >LOG OUT</Button>

<div style={{ marginTop: 20 }}>
<table className="table table-striped">
<thead>
<tr>
<th scope="col">seller name</th>
<th scope="col">product name</th>
<th scope="col">mcp price </th>
<th scope="col">BID price </th>


</tr>
</thead>
<tbody>
  {
    buy_data.map((val)=>(

    
          
 

      
<tr>
<td>{val.sname}</td>
<td>{val.pname}</td>




<td ><Button 

 disabled={(val.bidders_ids.includes(localStorage.getItem("localusername"))  && val.accepted.includes(localStorage.getItem("localusername")) ? true: false)}
  value={val.add+"+"+val.sname+"+"+val.pname+"+"+val.buyer_bid+"+"+val.bidders_ids}
   onClick={(ele)=>{
   console.log(ele.target);
 let buyer_bid_array=[]
 let bidders_id=[]

    let BP =   (prompt('enter bid price'))
    setbidprice(BP)
    let split=ele.target.value.split("+")

    buyer_bid_array.push(BP)

    bidders_id.push(localStorage.getItem("localusername"))

    
    buy_data.map((val,i)=>{

 

      if(split[0]==val.add && split[1]==val.sname && split[2]==val.pname){
    

        val.buyer_bid.map((ele)=>{
          buyer_bid_array.push(ele)
        })
        
        val.bidders_ids.map((ele)=>{
          bidders_id.push(ele)
        })
             
        let new_object={
          add:val.add,
          sname:val.sname,
          pname:val.pname,
          act:val.act,
          mcp:val.mcp,
          buyer_bid:buyer_bid_array,
          bidders_ids:bidders_id,
          no_bids:val.no_bids,
          accepted:val.accepted,
          rejected:val.rejected,

        }
        array.push(new_object)
    
      }
      else{
        array.push(val)
      }
     
    })

    update2(JSON.stringify(array))  
  }}
  
      >BID</Button></td>

{
      val.act== false ?(
<td ><h4>{val.mcp}</h4></td> 

      ):(
        <td ><h4>0</h4></td>
      )
    }

{
      val.act== false ?(

       
<td ><Button 
 disabled={(val.accepted.includes(localStorage.getItem("localusername")) || val.rejected.includes(localStorage.getItem("localusername")) ? true: false)}
 value={val.add+"+"+val.sname+"+"+val.pname+"+"+val.buyer_bid+"+"+val.bidders_ids}
 

onClick={(ele)=>{
  let split=ele.target.value.split("+")
  let acc=[]
  acc.push(localStorage.getItem("localusername"))

  buy_data.map((val,i)=>{

 

    if(split[0]==val.add && split[1]==val.sname && split[2]==val.pname){
  

      val.accepted.map((ele)=>{
        acc.push(ele)
      })
      
   
           
      let new_object={
        add:val.add,
        sname:val.sname,
        pname:val.pname,
        act:val.act,
        mcp:val.mcp,
        buyer_bid:val.buyer_bid,
        bidders_ids:val.bidders_ids,
        no_bids:val.no_bids,
        accepted:acc,
        rejected:val.rejected,

      }
      array.push(new_object)
  
    }
    else{
      array.push(val)
    }
   
  })

  update2(JSON.stringify(array))  

}}
>Accept</Button></td> 
      ):(
       null
      )
    }

{
      val.act== false ?(
<td ><Button
 disabled={(val.accepted.includes(localStorage.getItem("localusername")) || val.rejected.includes(localStorage.getItem("localusername")) ? true: false)}
 value={val.add+"+"+val.sname+"+"+val.pname+"+"+val.buyer_bid+"+"+val.bidders_ids}

onClick={(ele)=>{
  let split=ele.target.value.split("+")

  let rej=[]
  rej.push(localStorage.getItem("localusername"))

  buy_data.map((val,i)=>{

 

    if(split[0]==val.add && split[1]==val.sname && split[2]==val.pname){
  

      val.rejected.map((ele)=>{
        rej.push(ele)
      })
      
   
           
      let new_object={
        add:val.add,
        sname:val.sname,
        pname:val.pname,
        act:val.act,
        mcp:val.mcp,
        buyer_bid:val.buyer_bid,
        bidders_ids:val.bidders_ids,
        no_bids:val.no_bids,
        accepted:val.accepted,
        rejected:rej,

      }
      array.push(new_object)
  
    }
    else{
      array.push(val)
    }
   
  })

  update2(JSON.stringify(array))  

}}
>Reject</Button></td>
      ):(
      null
      )
    }
</tr>
      ))
  }

</tbody>
</table>

</div>

</>
) :
(
null
)
}

</>




);
}

export default Login;


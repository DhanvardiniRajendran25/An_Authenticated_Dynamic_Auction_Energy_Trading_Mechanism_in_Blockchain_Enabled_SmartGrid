pragma solidity ^0.5.13;

contract SimpleStorage
{

struct seller_info 
{

    address owner;
    string name;
    string password; 

}
struct buyer_info
{
    address owner;
    string name;
    string password;
}

string products;


mapping(address => seller_info) public my_seller_struct;
mapping(address => buyer_info) public my_buyer_struct;

function signup_sellers (address owner,string memory name,string memory password) public 

{   
    require (keccak256(abi.encodePacked(my_seller_struct[owner].password )) != keccak256(abi.encodePacked(password)),"you are already signed up as patient");
    my_seller_struct[owner] = seller_info(owner,name,password);

}

function signup_buyer (address owner,string memory name,string memory password) public 
{   
    require (keccak256(abi.encodePacked(my_buyer_struct[owner].password )) != keccak256(abi.encodePacked(password)),"you are already signed up as hospital");
    my_buyer_struct[owner] = buyer_info(owner,name,password);
}

function seller_login_validate (address ad,string memory pwd) public view returns(uint)
{
    if (keccak256(abi.encodePacked(my_seller_struct[ad].password )) == keccak256(abi.encodePacked(pwd)))
    {
    return 1;
    }
    else
    {
        return 0;
    }
}

function buyer_login_validate (address ad,string memory pwd) public view returns(uint)
{
    if (keccak256(abi.encodePacked(my_buyer_struct[ad].password )) == keccak256(abi.encodePacked(pwd)))
    {
    return 1;
    }
    else
    {
        return 0;
    }
}


function update_products (string memory data) public //"sellername,productname,buyer price,mcp price,buyer price 1,2,3,4,seller closing,buyer closing,#,repeates"
{
    products = data;

}

function view_products_buyers () public view returns(string memory)
{

    return (products);  

}
}
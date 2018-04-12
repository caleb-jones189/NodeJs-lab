var app=angular.module("cartApp",[]);
app.controller('cartCtrl', function($scope,$http,$window){
    // Q1) add two more pizza objects 
     $http({
  method: 'GET',
  url: '/menu'
}).then(function successCallback(response) {
    $scope.pizzas=response.data
  }, function errorCallback(response) {
    $scope.pizzas=[]
  });
   
    $scope.phone=""
    $scope.email=""
    $scope.msg="Items in cart"    



    // add two variables: cart, and total for web page cart.html
 	$scope.cart=JSON.parse(localStorage.getItem("cart"))
    $scope.total=0.0
    if($scope.cart==null)
    {
        $scope.cart=[];
        $scope.total=0.0;
        $scope.numItems=0;

    }
    else
    {
    $scope.numItems=$scope.cart.reduce((total, item) => total + item.quantity,0)
    }

//Q2: addToCart() 
    $scope.addToCart=function(item){
        let index=$scope.cart.findIndex(x=>x.pizzaName==item.pizzName)
        if (index==-1)//item is not in the cart 
        {
            item.quantity=1;
            //item has 4 properties name,price,img,quantity
            $scope.cart.push(item);

        }
        else

        {
            $scope.cart[index].quantity+=1;
        }
        $scope.numItems+=1
        localStorage.setItem("cart",JSON.stringify($scope.cart))
        //store cart locally so every web page can access it locally
    }


//Q3: removeFromCart() function
    $scope.removeFromCart=function(item){
         let index=$scope.cart.findIndex(x=>x.pizzaName==item.pizzaName)
        
        $scope.cart[index].quantity-=1.;
        $scope.total-=$scope.cart[index].price;

        if($scope.cart[index].quantity==0)
        {
            $scope.cart.splice(index,1)

        }

        if($scope.numItems==0)
        {
            $scope.numItems=0;
        

        }
        else
        {
            $scope.numItems-=1;

        }

        localStorage.setItem("cart",JSON.stringify($scope.cart))


    }

//Q4: clearCart() function
    $scope.clearCart=function(){
        //clear the cart,numItems,localStorage
        $scope.cart.splice(0,$scope.numItems)
        $scope.numItems=0
        $scope.total=0;
        localStorage.clear();
    }

//Q5: calcTotalPrice() function
	$scope.calcTotalPrice=function(){
        for (var i = 0;i<$scope.cart.length;i++)
        {
            $scope.total+=$scope.cart[i].quantity*$scope.cart[i].price;
        }
        localStorage.setItem("cart",JSON.stringify($scope.cart))


    }



    $scope.checkout=function()
    {
            $window.location.href="checkout.html";


    }

    $scope.placeOrder=function()
    {
        var checkoutData=[]

        checkoutData.push($scope.cart)
        checkoutData.push([{customerID:$scope.phone},{email:$scope.email}])
        $http({
            method:'POST',
            url:'/placeOrder',
            data: checkoutData,
        }).then(function successCallback(response){
            $scope.msg="Your order has been recieved. Thank you!"
            $scope.clearCart()
        },function errorCallback(response){
            $scope.msg="Sorry, server problem, try again!"
        });




    }   

})



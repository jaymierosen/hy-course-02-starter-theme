
// modal actions
function modalOpen(modal) {
	//close any open modals 
	modalClose();
	$('#' + modal).toggleClass('hidden').toggleClass('active');
}

function modalClose() {
	$('.modal.active').toggleClass('hidden').toggleClass('active');
} 


// add to cart actions

function addToCartUpdate(form, modal, message) {
	form.hide()
	form[0].reset()
	$('#' + modal).append('<p class="add-to-cart-message">' + message + '</p>')

	setTimeout(function() {
		modalClose();
		form.show()
		$('#' + modal + ' .add-to-cart-message').remove()
	}, 3000)
}

function addToCart(data, form, modal) {
	$.ajax({
	  type: "POST",
	  url: "/cart/add.js",
	  data: "quantity="+ data.quantity +"&id=" + data.variant,
	  dataType: "json",
	  success: function(res) {
	  	var message = res.title + ' has been added to your cart'
	  	addToCartUpdate(form, modal, message);
	  },
	  error: function(err) {
	  	console.log(err)
	  	var message = err.responseJSON.description
	    addToCartUpdate(form, modal, message)
	  }
	})
}

//create a new function with ajax request to shipping rates endpoint
function getShippingRates(data) {
	$.ajax({
	    Type: 'GET',
	    url: '/cart/shipping_rates.json', 
	    dataType: 'json', 
	    data: {
	        'shipping_address[zip]': data.zip, 
	        'shipping_address[country]' : data.country, 
	        'shipping_address[province]' : data.province
	    }, 
	        success: (res) => {
	        console.log(res);
	        //ANOTHER WAY OF DOING IT IS...
	        // var i = 0;
	        // for(i = 0; i < res.shipping_rates.length; i++) {
	        // 	$('#shipping-estimate').append('<p>the estimated shipping cost for current items is $' + res.shipping_rates[i].price + '</p>')
	        // 	console.log(res.shipping_rates[i].price)
	        // }
	        var shipping_container = $('<div>');
	        res.shipping_rates.forEach(function(rate) {
	        	// console.log(rate, 'this is it!');
	        	// shipping_container.append('<p>the estimated shipping cost for current items for' + rate.name + 'is going to be' + rate.price + '</p>');
	        	shipping_container.append(`<p>the estimated shipping cost for current items for ${rate.name} is going to be ${rate.price} </p>`);
	        })
	       	$('#shipping-estimate').html(shipping_container);
	    },
	        error: (err) => {
	        console.log(err);
	    }
	})
}

$(function(){

	$('[data-modal]').on('click', function(){
		modalOpen($(this).data('modal'))
	});

	$('.modal-close').on('click', function(){
		modalClose();
	});

	$('.js-add-to-cart-form').on('submit', function(e) {
		// prevent default page refresh on form submission
		e.preventDefault();
		// define the modal, form, and form data
		var modal = $('.modal.active').attr('id')
		var $form = $(this)
		var form_data = $form.serializeArray()
		let data = {};
		$(form_data).each(function(index, obj){
		    data[obj.name] = obj.value;
		});

		// call the add to cart function with the form data
		addToCart(data, $form, modal)
	})

	$('#shipping-calculator').on('submit', function(e) {
	        // prevent page refresh on form submit
	        e.preventDefault()

	        //select the form and serialize the form data
	        var form = $(this)
	        var form_data = form.serializeArray()
	        var data = {};

	        $(form_data).each(function(index, obj){
	            data[obj.name] = obj.value;
	        });

	        // pass the form data to the getShippingRate function to make the Ajax request
	        getShippingRates(data)

	        $(form)[0].reset()

	    });
	
})





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

	
})




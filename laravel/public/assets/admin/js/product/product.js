jQuery(document).ready(function () {
    updateAddToCartButtons(cartData);

    updateTotalPrice();

    $(".mobile-quantity-right-plus, .mobile-quantity-left-minus").click(
        function (e) {
            e.preventDefault();

            var container = $(this).closest(".input-group");
            var input = container.find("input[name='quantity']");

            var currentVal = parseInt(input.val(), 10);
            if (isNaN(currentVal)) {
                currentVal = 1;
            }

            if ($(this).hasClass("mobile-quantity-right-plus")) {
                input.val(currentVal + 1);
            } else if (
                $(this).hasClass("mobile-quantity-left-minus") &&
                currentVal > 1
            ) {
                input.val(currentVal - 1);
            }

            // Get productId and quantityValue from the input field within the container
            var productId = container
                .find("#mobile-quantity")
                .data("product-id");
            var quantityValue = input.val();

            updateProductQuantity(productId, quantityValue);
        }
    );

    $(".add-to-cart").click(function (e) {
        e.preventDefault();

        var productId = $(this).data("product-id");
        var isProductDetailsPage =
            window.location.href.includes("products-details");

        $.ajax({
            url: `/cart/add/${productId}`,
            method: "get",
            data: {
                _token: "{{ csrf_token() }}",
            },
            success: function (response) {
                $(".cart_qty_cls").text(response.cartQuantity);
                console.log("response.cartQuantity", response.cartQuantity);
                if (response.removeSuccess) {
                    toastr.error(response.removeSuccess);
                    toastr.clear($("#error-msg"));

                    setTimeout(function () {
                        toastr.clear();
                    }, 3000);
                    updateAddToCartButtons(response.cart);
                } else {
                    toastr.success(response.addSuccess);
                    toastr.clear($("#error-msg"));

                    setTimeout(function () {
                        toastr.clear();
                    }, 3000);
                    updateAddToCartButtons(response.cart);

                    if (isProductDetailsPage) {
                        var quantityValue = $("input[name='quantity']").val();
                        updateProductQuantity(productId, quantityValue);
                    }
                }
            },
            error: function (error) {
                $("#error-msg")
                    .html(
                        '<div class="alert alert-danger alert-dismissible" role="alert">' +
                            '<button type="button" class="btn-close" data-dismiss="alert"></button>' +
                            "An error occurred. Please try again." +
                            "</div>"
                    )
                    .show();

                $("#success-msg").hide();
            },
        });
    });

    function updateAddToCartButtons(cartData) {
        $(".add-to-cart").each(function () {
            var productId = $(this).data("product-id");

            var isInCart = isProductInCart(productId, cartData);
            var isProductDetailsPage =
                window.location.href.includes("products-details");
            var iconElement = $(
                '<i class="fa fa-shopping-cart me-1" aria-hidden="true"></i>'
            );
            if (isInCart) {
                if (isProductDetailsPage) {
                    $(this)
                        .html(iconElement.clone())
                        .append(" remove from cart");
                } else {
                    $(this).css("color", "white");
                    $(this).css("background-color", "#FF4C3B");
                }
            } else {
                if (isProductDetailsPage) {
                    $(this).html(iconElement.clone()).append(" add to cart");
                } else {
                    $(this).css("color", "black");
                    $(this).css("background-color", "white");
                }
            }
        });
    }

    function isProductInCart(productId, cartData) {
        return cartData.hasOwnProperty(productId);
    }

    // remove product from cart page
    $(".remove-from-cart").click(function (e) {
        e.preventDefault();

        var productId = $(this).data("product-id");

        $.ajax({
            url: `cart/remove/${productId}`,
            method: "get",
            data: {
                _token: "{{ csrf_token() }}",
            },
            success: function (response) {
                $(".cart_qty_cls").text(response.cartQuantity);
                if (response.cartQuantity === 0) {
                    $("#empty-cart-message").show();
                    $("#cart-items").hide();
                    $("#calculation-total-balance").hide();
                } else {
                    $("#empty-cart-message").hide();
                    $("#cart-items").show();
                }

                $("tr[data-product-id='" + productId + "']").remove();

                toastr.error(response.success);
                toastr.clear($("#error-msg"));

                setTimeout(function () {
                    toastr.clear();
                }, 3000);
                console.log("Item removed successfully");
                updateTotalPrice();
            },
            error: function (error) {
                console.log("error from cart", error);
            },
        });
    });

    // update product quantity
    function updateProductQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            $.ajax({
                url: `cart/remove/${productId}`,
                method: "get",
                data: {
                    _token: "{{ csrf_token() }}",
                },
                success: function (response) {
                    $(".cart_qty_cls").text(response.cartQuantity);
                    if (response.cartQuantity === 0) {
                        $("#empty-cart-message").show();
                        $("#cart-items").hide();
                    } else {
                        $("#empty-cart-message").hide();
                        $("#cart-items").show();
                    }

                    $("tr[data-product-id='" + productId + "']").remove();

                    toastr.error(response.success);
                    toastr.clear($("#error-msg"));

                    setTimeout(function () {
                        toastr.clear();
                    }, 3000);
                    console.log("Item removed successfully");
                    updateTotalPrice();
                },
                error: function (error) {
                    console.log("error from cart", error);
                },
            });
        } else {
            $.ajax({
                url: `/cart/update-quantity/${productId}`,
                method: "get",
                data: {
                    _token: "{{ csrf_token() }}",
                    quantity: newQuantity,
                },
                success: function (response) {
                    console.log(response);
                    $("#quantity-" + productId).text(newQuantity);

                    $("#business-volume-" + productId).text(
                        "BV " +
                            formatNumberWithCommas(response.newBusinessVolume)
                    );

                    var newBV = formatNumberWithCommas(
                        response.newBusinessVolume
                    );
                    var bvtotk = formatNumberWithCommas(response.bvToTk);
                    var bvConvertedTk = formatTakaWithCommas(
                        response.newConvertedProductPrice
                    );

                    $("#converted_price-" + productId).text(
                        bvConvertedTk + " Tk. "
                    );

                    updateTotalPrice();
                },
                error: function (error) {
                    console.log("Error updating quantity", error);
                },
            });
        }
    }

    // calculate product total price
    function updateTotalPrice() {
        var totalPrice = 0;
        var bvConvertedTk = 0;

        $(".cart-item").each(function () {
            var quantity;

            if ($("#product-quantity-input-mobile").is(":visible")) {
                quantity = $(this).find(".resp-quantity").val();
            } else {
                quantity = $(this).find(".quantity").val();
            }

            var duePurchaseRangeParseFloat = parseFloat(
                $("#purchaseRange").val()
            );
            var duePurchaseRange = $("#purchaseRange").val();

            console.log("duePurchaseRange", duePurchaseRange);
            var userType = $("#user_type").val();

            var businessVolume = parseFloat($(this).data("business-volume"));

            var updatedBvToTk = $("#updatedBvToTk").val();

            totalPrice += quantity * businessVolume;
            console.log("totalPrice222", totalPrice);

            if (userType == "user") {
                if (duePurchaseRangeParseFloat < parseFloat(totalPrice)) {
                    $("#checkout-btn").attr("hidden", true);

                    $("#purchase_range_error").text(
                        `You have exceeded the purchase range. Your available purchase BV: ${duePurchaseRange}`
                    );
                    $("#purchase_range_error").attr("hidden", false);
                } else {
                    $("#checkout-btn").removeAttr("hidden");
                    $("#purchase_range_error").text("");
                    $("#purchase_range_error").attr("hidden", true);
                }
            }

            bvConvertedTk = totalPrice * updatedBvToTk;
            console.log("bvConvertedTk", bvConvertedTk);

            $("#total-price").text(formatNumberWithCommas(totalPrice) + " BV");
            $("#total_converted_price").text(
                formatTakaWithCommas(bvConvertedTk) + " TK. "
            );
        });
    }

    // when change product quantity
    $('input[name="quantity"]').change(function () {
        var productId = $(this).data("product-id");
        var newQuantity = $(this).val();
        console.log("productId", productId);
        updateProductQuantity(productId, newQuantity);
    });

    // Increment quantity
    $(".quantity-right-plus").click(function (e) {
        e.preventDefault();
        var input = $(this)
            .closest(".input-group")
            .find("input[name='quantity']");
        var currentVal = parseInt(input.val(), 10);

        if (!isNaN(currentVal)) {
            input.val(currentVal + 1);
        } else {
            input.val(1);
        }
    });

    // Decrement quantity
    $(".quantity-left-minus").click(function (e) {
        e.preventDefault();
        var input = $(this)
            .closest(".input-group")
            .find("input[name='quantity']");
        var currentVal = parseInt(input.val(), 10);

        if (!isNaN(currentVal) && currentVal > 1) {
            input.val(currentVal - 1);
        } else {
            input.val(1);
        }
    });

    function formatNumberWithCommas(number) {
        const formatter = new Intl.NumberFormat("en-IN", {
            style: "decimal",
            minimumFractionDigits: 4,
            maximumFractionDigits: 4,
        });

        const formattedNumber = formatter.format(number);

        return formattedNumber;
    }

    function formatTakaWithCommas(number) {
        const formatter = new Intl.NumberFormat("en-IN", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const formattedNumber = formatter.format(number);

        return formattedNumber;
    }
});

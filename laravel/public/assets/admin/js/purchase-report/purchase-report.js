$(document).ready(function () {
    // when click for get user data by identity address
    $("#checkOrderIdForReport").on("click", function () {
        var OrderIDValue = $("#order_id").val();

        if (validateOrderIdField()) {
            $.ajax({
                url: `/admin/reports/search/get-result/${OrderIDValue}`,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    var responseData = JSON.parse(response);

                    // Access the sale ID
                    var saleId = responseData;

                    window.location.href = "/cart/order-details/" + saleId;
                },
                error: function (error) {
                    console.error("Error:", error);
                    $(".order_id_error").text(
                        "No report found for the provided order ID."
                    );
                },
            });
        }
    });

    function validateOrderIdField() {
        // Reset error messages and styles
        $(".error-message").text("");
        $("input, select").removeClass("error");

        // Get the value of the identity field
        var orderIdValue = $("#order_id").val();

        // Validate the identity field using jQuery
        if (isNaN(orderIdValue)) {
            $(".order_id_error").text("Please enter a valid numeric order ID.");
            $("#order_id").addClass("error");
            $("#order_id").css("border-color", "red");

            return false;
        } else if (orderIdValue.length > 30) {
            $(".order_id_error").text(
                "Order ID length should not exceed 30 characters."
            );
            $("#order_id").addClass("error");
            $("#order_id").css("border-color", "red");

            return false;
        }

        // Add red border color to the input field
        if ($("#order_id").hasClass("error")) {
            $("#order_id").css("border-color", "red");
            return false;
        } else {
            $("#order_id").css("border-color", "");
            return true;
        }
    }

    $("body").on("input", "#order_id", function () {
        var orderIdValue = $(this).val();

        // Reset previous error messages and styling
        $(".order_id_error").text("");
        $("#order_id").css("border-color", "");

        // Validate the order id field using jQuery
        if (isNaN(orderIdValue)) {
            $(".order_id_error").text("Please enter a valid numeric order ID.");
            $("#order_id").addClass("error");
            $("#order_id").css("border-color", "red");
        } else if (orderIdValue.length > 30) {
            $(".order_id_error").text(
                "Order ID length should not exceed 30 characters."
            );
            $("#order_id").addClass("error");
            $("#order_id").css("border-color", "red");
        } else {
            $(".order_id_error").text("");
            $("#order_id").removeClass("error");
            $("#order_id").css("border-color", "");
        }
    });
});

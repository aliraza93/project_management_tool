$(document).ready(function () {
    // when click for get user data by identity address
    $("#checkIdentity").on("click", function () {
        $("#existed_user_box").attr("hidden", true);
        var identityValue = $("#identity").val();
        if (validateIdentityField()) {
            $.ajax({
                url: `/admin/payment-info/check-identity/${identityValue}`,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    var userAddress = response.userAddress;
                    var userPaymentInfo = response.bankInformation;
                    var isExistPaymentInfo = response.isBankInfoStatus;

                    if (isExistPaymentInfo == 1) {
                        $.each(userAddress, function (index, address) {
                            var cardHtml =
                                '<div class="card-body">' +
                                '<h6 class="card-title mb-3">User Information</h6>' +
                                '<p class="mb-1">Name: ' +
                                address.name +
                                "</p>" +
                                '<p class="mb-1">Mobile: ' +
                                address.mobile_no +
                                "</p>" +
                                '<p class="mb-1">Email: ' +
                                address.email +
                                "</p>" +
                                "</div>" +
                                '<div class="card-body border-top">' +
                                '<h6 class="card-title mb-3">Payment Information</h6>';

                            if (userPaymentInfo.media_type == 1) {
                                cardHtml +=
                                    '<p class="mb-1">Bank Name: ' +
                                    userPaymentInfo.bank_name +
                                    "</p>" +
                                    '<p class="mb-1">Bank Account Name: ' +
                                    userPaymentInfo.bank_account_name +
                                    "</p>" +
                                    '<p class="mb-1">Bank Account Number: ' +
                                    userPaymentInfo.bank_account_number +
                                    "</p>" +
                                    '<p class="mb-1">Bank Branch Name: ' +
                                    userPaymentInfo.bank_branch_name +
                                    "</p>" +
                                    '<p class="mb-1">Bank Branch Routing Number: ' +
                                    userPaymentInfo.bank_branch_routing_number +
                                    "</p>" +
                                    '<p class="mb-1">Netmark Registered Number: ' +
                                    userPaymentInfo.netmark_registered_number +
                                    "</p>";
                            } else if (userPaymentInfo.media_type == 2) {
                                cardHtml +=
                                    '<p class="mb-1">bKash Mobile Number: ' +
                                    userPaymentInfo.bkash_mobile_number +
                                    "</p>" +
                                    '<p class="mb-1">Netmark Registered Number: ' +
                                    userPaymentInfo.netmark_registered_number +
                                    "</p>";
                            } else {
                                cardHtml +=
                                    '<p class="mb-1">Nagad Mobile Number: ' +
                                    userPaymentInfo.nagad_mobile_number +
                                    "</p>" +
                                    '<p class="mb-1">Netmark Registered Number: ' +
                                    userPaymentInfo.netmark_registered_number +
                                    "</p>";
                            }

                            cardHtml +=
                                '<p class="mb-1"><button class="btn btn-primary mt-3" id="editPaymentInfoButton">Edit Payment Info</button></p>' +
                                "</div>";

                            $("#existed_user_box").removeAttr("hidden");
                            $("#existed_user_box").html(cardHtml);

                            document
                                .getElementById("editPaymentInfoButton")
                                .addEventListener("click", function () {
                                    // Redirect to another page with parameters in the URL
                                    window.location.href =
                                        "/admin/edit-payment-info/" +
                                        encodeURIComponent(address.identity);
                                });
                        });
                    } else {
                        $.each(userAddress, function (index, address) {
                            var cardHtml =
                                '<div class="card-body">' +
                                '<h6 class="card-title mb-3">User Information</h6>' +
                                '<p class="mb-1">Name: ' +
                                address.name +
                                "</p>" +
                                '<p class="mb-1">Mobile: ' +
                                address.mobile_no +
                                "</p>" +
                                '<p class="mb-1">Email: ' +
                                address.email +
                                "</p>" +
                                "</div>" +
                                '<div class="card-body border-top">' +
                                '<h6 class="card-title mb-3">Payment Information</h6>';

                            if (Number(address.top_id)) {
                                cardHtml +=
                                    '<p class="mb-1">Payment information not found.</p>' +
                                    '<p class="mb-1"><button class="btn btn-primary" id="addPaymentInfoButton">Add Payment Info</button></p>';
                            } else {
                                cardHtml +=
                                    "<p style='color: red; font-size: 12px;'>It's a child id, so you can't add payment info.</p>";
                            }

                            cardHtml += "</div>";

                            cardHtml += "</div>";

                            $("#existed_user_box").removeAttr("hidden");
                            $("#existed_user_box").html(cardHtml);

                            document
                                .getElementById("addPaymentInfoButton")
                                .addEventListener("click", function () {
                                    // Redirect to another page with parameters in the URL
                                    window.location.href =
                                        "/admin/add-payment-info/" +
                                        encodeURIComponent(address.identity);
                                });
                        });
                    }
                },
                error: function (error) {
                    console.error("Error:", error);
                    $(".identity-error").text(
                        "No user found for the provided identity."
                    );
                },
            });
        }
    });

    function validateIdentityField() {
        // Reset error messages and styles
        $(".error-message").text("");
        $("input, select").removeClass("error");

        // Get the value of the identity field
        var identityValue = $("#identity").val();

        // Validate the identity field using jQuery
        if (isNaN(identityValue)) {
            $(".identity-error").text("Please enter a valid numeric identity.");
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");

            return false;
        } else if (identityValue.length < 9) {
            $(".identity-error").text(
                "Identity length should be at least 9 characters."
            );
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");

            return false;
        } else if (identityValue.length > 14) {
            $(".identity-error").text(
                "Identity length should not exceed 14 characters."
            );
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");

            return false;
        }

        // Add red border color to the input field
        if ($("#identity").hasClass("error")) {
            $("#identity").css("border-color", "red");
            return false;
        } else {
            $("#identity").css("border-color", "");
            return true;
        }
    }

    $("body").on("input", "#identity", function () {
        var identityValue = $(this).val();

        // Reset previous error messages and styling
        $("#identity-error").text("");
        $("#identity").css("border-color", "");

        // Validate the identity field using jQuery
        if (isNaN(identityValue)) {
            $(".identity-error").text("Please enter a valid numeric identity.");
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");
        } else if (identityValue.length < 9) {
            $(".identity-error").text(
                "Identity length should be at least 9 characters."
            );
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");
        } else if (identityValue.length > 14) {
            $(".identity-error").text(
                "Identity length should not exceed 14 characters."
            );
            $("#identity").addClass("error");
            $("#identity").css("border-color", "red");
        } else {
            $(".identity-error").text("");
            $("#identity").removeClass("error");
            $("#identity").css("border-color", "");
        }
    });
});

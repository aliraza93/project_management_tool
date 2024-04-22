$(document).ready(function () {
    // when click for get user data by identity address
    $("#checkIdentity").on("click", function () {
        $("#existed_user_box").attr("hidden", true);
        var identityValue = $("#identity").val();
        if (validateIdentityField()) {
            $.ajax({
                url: `/admin/query-withdrawals/check-identity/${identityValue}`,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    var withdrawalRequests = response.withdrawalRequests;
                    var isWithdarwalRequestsStatus =
                        response.isWithdarwalRequestsStatus;

                    var userAddress = response.userAddress;
                    var userPaymentInfo = response.bankInformation;
                    var isExistPaymentInfo = response.isBankInfoStatus;

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
                            "</div>";

                        // Check if payment info exists and add it to the cardHtml
                        if (isExistPaymentInfo == 1) {
                            cardHtml +=
                                '<div class="card-body border-top">' +
                                '<h6 class="card-title mb-0">Payment Information</h6>' +
                                // Add more payment information here
                                "</div>";
                        }

                        if (isExistPaymentInfo == 1) {
                            if (userPaymentInfo.media_type == 1) {
                                cardHtml +=
                                    '<div class="card-body py-0">' +
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
                                    "</p>" +
                                    "</div>";
                            } else if (userPaymentInfo.media_type == 2) {
                                cardHtml +=
                                    '<div class="card-body">' +
                                    '<p class="mb-1">bKash Mobile Number: ' +
                                    userPaymentInfo.bkash_mobile_number +
                                    "</p>" +
                                    '<p class="mb-1">Netmark Registered Number: ' +
                                    userPaymentInfo.netmark_registered_number +
                                    "</p>" +
                                    "</div>";
                            } else {
                                cardHtml +=
                                    '<div class="card-body">' +
                                    '<p class="mb-1">Nagad Mobile Number: ' +
                                    userPaymentInfo.nagad_mobile_number +
                                    "</p>" +
                                    '<p class="mb-1">Netmark Registered Number: ' +
                                    userPaymentInfo.netmark_registered_number +
                                    "</p>" +
                                    "</div>";
                            }
                        }

                        if (isWithdarwalRequestsStatus == 1) {
                            // Append the table HTML here
                            cardHtml +=
                                '<div class="table-responsive table-desi">' +
                                '<table class="table">' +
                                "<thead>" +
                                "<tr>" +
                                "<th>SN</th>" +
                                "<th>Date</th>" +
                                "<th>Withdraw BV</th>" +
                                "<th>Withdraw Tk</th>" +
                                "<th>Medium</th>" +
                                "</tr>" +
                                "</thead>" +
                                "<tbody>";

                            // Use a loop to iterate through the withdrawal requests in JavaScript
                            let serialNumber = 1;
                            function generateTableRow(
                                serialNumber,
                                formattedDate,
                                withdrawBV,
                                withdrawTK,
                                medium
                            ) {
                                return `<tr>
                <td class="align-middle">${serialNumber}</td>
                <td class="align-middle">${formattedDate}</td>
                <td class="align-middle">${withdrawBV} BV</td>
                <td class="align-middle">${withdrawTK} TK</td>
                <td class="align-middle">${medium}</td>
            </tr>`;
                            }
                            // Inside the loop where you generate the HTML for the table
                            for (
                                let i = 0;
                                i < withdrawalRequests.length;
                                i++
                            ) {
                                let medium = "";

                                // Determine the withdrawal method based on the media_type
                                switch (withdrawalRequests[i].media_type) {
                                    case 1:
                                        medium = "Bank";
                                        break;
                                    case 2:
                                        medium = "bKash";
                                        break;
                                    case 3:
                                        medium = "Nagad";
                                        break;
                                    default:
                                        medium = "Unknown";
                                        break;
                                }
                                let formattedDate = moment(
                                    withdrawalRequests[i].created_at
                                ).format("YYYY-MM-DD HH:mm:ss");
                                cardHtml += generateTableRow(
                                    serialNumber++,
                                    formattedDate,
                                    withdrawalRequests[i].withdraw_bv,
                                    withdrawalRequests[i].withdraw_tk,
                                    medium
                                );
                            }

                            // Close the table HTML and cardHtml
                            cardHtml +=
                                "</tbody>" + "</table>" + "</div>" + "</div>";
                        }

                        $("#existed_user_box").removeAttr("hidden");
                        $("#existed_user_box").html(cardHtml);
                    });
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

$(document).ready(function () {
    $("#matchingModalSubmitBtn").on("click", function () {
        var formData = new FormData($("#matchingIncomeModalForm")[0]);
        // Disable the button with the id matchingModalSubmitBtn
        $("#matchingModalSubmitBtn").prop("disabled", true);

        $.ajax({
            type: "POST",
            url: $("#matchingIncomeModalForm").attr("action"),
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                var matchingWithdrawIncome = response.matching_withdraw_amount;
                $("#matchingModalSubmitBtn").prop("disabled", false);
                $("#cashbackWithdrawalModal").modal("hide");
                $("#confirmationModal").modal("show");

                $("#transferredwithdrawalAmount").text(
                    formatNumberWithCommas(matchingWithdrawIncome)
                );

                // Show the modal
                $("#confirmBtnForTransferred").on("click", function () {
                    window.location.href = "/dashboard";
                });
            },
            error: function (xhr, status, error) {
                $("#matchingModalSubmitBtn").prop("disabled", false);

                if (xhr.status === 422) {
                    // Validation failed
                    var errors = xhr.responseJSON.errors;
                    alert(
                        "Validation Error: " +
                            Object.values(errors).flat().join("\n")
                    );
                } else {
                    alert("Error: " + error);
                }
            },
        });
    });

    // after check and uncheck checkbox
    $("#cashbackWithdrawAll").on("change", function () {
        handleCashbackWithdrawAll();
    });

    // cashback Withdraw Amount
    $("body").on("input", "#cashbackWithdrawAmount", function () {
        var value = Number(
            $(this)
                .val()
                .replace(/[^0-9]/g, "")
        );
        var availableAmount = Number($(this).attr("data-amount"));
        console.log("availableAmount", availableAmount);

        if (availableAmount < value) {
            $("#cashbackWithdrawAmountError").text(
                `Withdrawal amount cannot exceed BV ${availableAmount}.`
            );
            $("#cashbackWithdrawAmount").css("border-color", "red");
        } else {
            if (!value) {
                $("#cashbackWWithdrawAmountError").text(
                    "Withdrawal amount is required."
                );
                $("#cashbackWithdrawAmount").css("border-color", "red");
            } else {
                $("#cashbackWWithdrawAmountError").text("");
                $("#cashbackWithdrawAmount").css("border-color", "");
            }
        }

        if (value) {
            $(this).val(value);
        } else {
            $(this).val("");
        }
    });

    // transaction code
    $("#cashback_transaction_pin_code").on("input", function () {
        var value = $(this).val().replace(/\D/g, "");
        console.log("hello");
        if (value.length < 5) {
            $("#cashback_transaction_pin_code_error").text(
                `Please enter a valid numeric pin code with a length minimum 5 digits.`
            );
            $("#cashback_transaction_pin_code").css("border-color", "red");
        } else {
            $("#cashback_transaction_pin_code_error").text("");
            $("#cashback_transaction_pin_code").css("border-color", "");
        }

        if (!value) {
            $("#cashback_transaction_pin_code_error").text(
                "Transaction pin code is required."
            );
            $("#cashback_transaction_pin_code").css("border-color", "red");
        }

        if (value) {
            $(this).val(value);
        } else {
            $(this).val("");
        }
    });

    $("#confirmationModal").modal({
        backdrop: "static", // Prevents closing the modal by clicking outside
        keyboard: false, // Prevents closing the modal with the escape key
    });
});

// handle check box of withdreaw all
function handleCashbackWithdrawAll() {
    var cashbackTotalIncome = $("#cashback_total_income").val();
    var withdrawAmountField = document.getElementById("cashbackWithdrawAmount");
    var withdrawAllCheckbox = document.getElementById("cashbackWithdrawAll");

    if (withdrawAllCheckbox.checked) {
        withdrawAmountField.value = parseInt(cashbackTotalIncome);
        var inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        withdrawAmountField.dispatchEvent(inputEvent);
        $("#cashbackWithdrawAmount").prop("readonly", true);
        $("#cashbackWithdrawAmount").css({
            "background-color": "#cccccc",
            cursor: "move",
        });
    } else {
        withdrawAmountField.value = "";
        $("#cashbackWithdrawAmount").prop("readonly", false);
        $("#cashbackWithdrawAmount").css({
            "background-color": "",
            cursor: "",
        });
    }
}

function formatNumberWithCommas(number) {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedNumber = formatter.format(number);

    return formattedNumber;
}

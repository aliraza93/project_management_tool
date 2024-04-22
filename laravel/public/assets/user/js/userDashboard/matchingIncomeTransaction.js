$(document).ready(function () {
    $("#matchingIncomeModalSubmitBtn").on("click", function () {
        var formData = new FormData($("#matchingModalForm")[0]);

        $("#matchingIncomeModalSubmitBtn").prop("disabled", true);
        $.ajax({
            type: "POST",
            url: $("#matchingModalForm").attr("action"),
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#matchingIncomeModalSubmitBtn").prop("disabled", false);
                var matchingWithdrawIncome = response.matching_withdraw_amount;
                $("#matchingWithdrawalModal").modal("hide");
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
                $("#matchingIncomeModalSubmitBtn").prop("disabled", false);
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
    $("#matchingWithdrawAll").on("change", function () {
        handleMatchingWithdrawAll();
    });

    // matchingWithdrawAmount
    $("body").on("input", "#matchingWithdrawAmount", function () {
        var value = Number(
            $(this)
                .val()
                .replace(/[^0-9]/g, "")
        );
        var availableAmount = Number($(this).attr("data-amount"));
        console.log("availableAmount", availableAmount);

        if (availableAmount < value) {
            $("#matchingWWithdrawAmountError").text(
                `Withdrawal amount cannot exceed BV ${availableAmount}.`
            );
            $("#matchingWithdrawAmount").css("border-color", "red");
        } else {
            if (!value) {
                $("#matchingWWithdrawAmountError").text(
                    "Withdrawal amount is required."
                );
                $("#matchingWithdrawAmount").css("border-color", "red");
            } else {
                $("#matchingWWithdrawAmountError").text("");
                $("#matchingWithdrawAmount").css("border-color", "");
            }
        }

        if (value) {
            $(this).val(value);
        } else {
            $(this).val("");
        }
    });

    // transaction code
    $("#matching_transaction_pin_code").on("input", function () {
        var value = $(this).val().replace(/\D/g, "");
        console.log("value.length", value.length);
        if (value.length < 5) {
            $("#matching_transaction_pin_code_error").text(
                `Please enter a valid numeric pin code with a length minimum 5 digits.`
            );
            $("#matching_transaction_pin_code").css("border-color", "red");
        } else {
            $("#matching_transaction_pin_code_error").text("");
            $("#matching_transaction_pin_code").css("border-color", "");
        }

        if (!value) {
            $("#matching_transaction_pin_code_error").text(
                "Transaction pin code is required."
            );
            $("#matching_transaction_pin_code").css("border-color", "red");
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
function handleMatchingWithdrawAll() {
    var matchingTotalIncome = $("#matching_total_income").val();
    var withdrawAmountField = document.getElementById("matchingWithdrawAmount");
    var withdrawAllCheckbox = document.getElementById("matchingWithdrawAll");

    if (withdrawAllCheckbox.checked) {
        withdrawAmountField.value = parseInt(matchingTotalIncome);
        var inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        withdrawAmountField.dispatchEvent(inputEvent);
        $("#matchingWithdrawAmount").prop("readonly", true);
        $("#matchingWithdrawAmount").css({
            "background-color": "#cccccc",
            cursor: "move",
        });
    } else {
        withdrawAmountField.value = "";
        $("#matchingWithdrawAmount").prop("readonly", false);
        $("#matchingWithdrawAmount").css({
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

$(document).ready(function () {
    $("#refIncomeModalSubmitBtn").on("click", function () {
        var formData = new FormData($("#refIncomeModalForm")[0]);
        $("#refIncomeModalSubmitBtn").prop("disabled", true);

        $.ajax({
            type: "POST",
            url: $("#refIncomeModalForm").attr("action"),
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#refIncomeModalSubmitBtn").prop("disabled", false);
                $("#refWithdrawalModal").modal("hide");

                var refWithdrawIncome = response.ref_withdraw_amount;
                $("#confirmationModal").modal("show");

                $("#transferredwithdrawalAmount").text(
                    formatNumberWithCommas(refWithdrawIncome)
                );

                // Show the modal
                $("#confirmBtnForTransferred").on("click", function () {
                    window.location.href = "/dashboard";
                });
            },
            error: function (xhr, status, error) {
                $("#refIncomeModalSubmitBtn").prop("disabled", false);

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
    $("#refWithdrawAll").on("change", function () {
        handleRefWithdrawAll();
    });

    // refWithdrawAmount
    $("body").on("input", "#refWithdrawAmount", function () {
        var value = Number(
            $(this)
                .val()
                .replace(/[^0-9]/g, "")
        );
        var availableAmount = Number($(this).attr("data-amount"));
        console.log("availableAmount", availableAmount);

        if (availableAmount < value) {
            $("#refWWithdrawAmountError").text(
                `Withdrawal amount cannot exceed BV ${availableAmount}.`
            );
            $("#refWithdrawAmount").css("border-color", "red");
        } else {
            if (!value) {
                $("#refWWithdrawAmountError").text(
                    "Withdrawal amount is required."
                );
                $("#refWithdrawAmount").css("border-color", "red");
            } else {
                $("#refWWithdrawAmountError").text("");
                $("#refWithdrawAmount").css("border-color", "");
            }
        }

        if (value) {
            $(this).val(value);
        } else {
            $(this).val("");
        }
    });

    // transaction code
    $("#ref_transaction_pin_code").on("input", function () {
        var value = $(this).val().replace(/\D/g, "");
        console.log("hello");
        if (value.length < 5) {
            $("#ref_transaction_pin_code_error").text(
                `Please enter a valid numeric pin code with a length minimum 5 digits.`
            );
            $("#ref_transaction_pin_code").css("border-color", "red");
        } else {
            $("#ref_transaction_pin_code_error").text("");
            $("#ref_transaction_pin_code").css("border-color", "");
        }

        if (!value) {
            $("#ref_transaction_pin_code_error").text(
                "Transaction pin code is required."
            );
            $("#ref_transaction_pin_code").css("border-color", "red");
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
function handleRefWithdrawAll() {
    var refTotalIncome = $("#referral_total_income").val();
    var withdrawAmountField = document.getElementById("refWithdrawAmount");
    var withdrawAllCheckbox = document.getElementById("refWithdrawAll");

    if (withdrawAllCheckbox.checked) {
        withdrawAmountField.value = parseInt(refTotalIncome);
        var inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        withdrawAmountField.dispatchEvent(inputEvent);
        $("#refWithdrawAmount").prop("readonly", true);
        $("#refWithdrawAmount").css({
            "background-color": "#cccccc",
            cursor: "move",
        });
    } else {
        withdrawAmountField.value = "";
        $("#refWithdrawAmount").prop("readonly", false);
        $("#refWithdrawAmount").css({
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

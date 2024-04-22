$(document).ready(function () {
    $("#generationIncomeModalSubmitBtn").on("click", function () {
        var formData = new FormData($("#generationModalForm")[0]);

        $("#generationIncomeModalSubmitBtn").prop("disabled", true);

        $.ajax({
            type: "POST",
            url: $("#generationModalForm").attr("action"),
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#generationIncomeModalSubmitBtn").prop("disabled", false);
                var generationWithdrawIncome =
                    response.generation_withdraw_amount;

                $("#confirmationModal").modal("show");
                $("#generationWithdrawalModal").modal("hide");

                $("#transferredwithdrawalAmount").text(
                    formatNumberWithCommas(generationWithdrawIncome)
                );

                // Show the modal
                $("#confirmBtnForTransferred").on("click", function () {
                    window.location.href = "/dashboard";
                });
            },
            error: function (xhr, status, error) {
                $("#generationIncomeModalSubmitBtn").prop("disabled", false);
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
    $("#generationWithdrawAll").on("change", function () {
        handleGenerationWithdrawAll();
    });

    // generation Withdraw Amount
    $("body").on("input", "#generationWithdrawAmount", function () {
        var value = Number(
            $(this)
                .val()
                .replace(/[^0-9]/g, "")
        );
        var availableAmount = Number($(this).attr("data-amount"));
        console.log("availableAmount", availableAmount);

        if (availableAmount < value) {
            $("#generationWithdrawAmountError").text(
                `Withdrawal amount cannot exceed BV ${availableAmount}.`
            );
            $("#generationWithdrawAmount").css("border-color", "red");
        } else {
            if (!value) {
                $("#generationWithdrawAmountError").text(
                    "Withdrawal amount is required."
                );
                $("#generationWithdrawAmount").css("border-color", "red");
            } else {
                $("#generationWithdrawAmountError").text("");
                $("#generationWithdrawAmount").css("border-color", "");
            }
        }

        if (value) {
            $(this).val(value);
        } else {
            $(this).val("");
        }
    });

    // transaction code
    $("#generation_transaction_pin_code").on("input", function () {
        var value = $(this).val().replace(/\D/g, "");

        if (value.length < 5) {
            $("#generation_transaction_pin_code_error").text(
                `Please enter a valid numeric pin code with a length minimum 5 digits.`
            );
            $("#generation_transaction_pin_code").css("border-color", "red");
        } else {
            $("#generation_transaction_pin_code_error").text("");
            $("#generation_transaction_pin_code").css("border-color", "");
        }

        if (!value) {
            $("#generation_transaction_pin_code_error").text(
                "Transaction pin code is required."
            );
            $("#generation_transaction_pin_code").css("border-color", "red");
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
function handleGenerationWithdrawAll() {
    var generationTotalIncome = $("#generation_total_income").val();
    var withdrawAmountField = document.getElementById(
        "generationWithdrawAmount"
    );
    var withdrawAllCheckbox = document.getElementById("generationWithdrawAll");

    if (withdrawAllCheckbox.checked) {
        withdrawAmountField.value = parseInt(generationTotalIncome);
        var inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        withdrawAmountField.dispatchEvent(inputEvent);
        $("#generationWithdrawAmount").prop("readonly", true);
        $("#generationWithdrawAmount").css({
            "background-color": "#cccccc",
            cursor: "move",
        });
    } else {
        withdrawAmountField.value = "";
        $("#generationWithdrawAmount").prop("readonly", false);
        $("#generationWithdrawAmount").css({
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

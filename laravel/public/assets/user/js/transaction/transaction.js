$(document).ready(function () {
    $("#withdrawMainModalSubmitBtn").on("click", function () {
        var formData = new FormData($("#withdrawMainAmountModalForm")[0]);
        $("#withdrawMainModalSubmitBtn").prop("disabled", true);

        $.ajax({
            type: "POST",
            url: $("#withdrawMainAmountModalForm").attr("action"),
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $("#withdrawMainModalSubmitBtn").prop("disabled", false);
                var withdrawTotalAmount = response.withdraw_total_amount;
                $("#withdrawMainAmountModal").modal("hide");
                $("#confirmationModal").modal("show");

                $("#requestWithdrawAmount").text(
                    formatTakaWithCommas(withdrawTotalAmount)
                );

                // Show the modal
                $("#confirmBtnForTransferred").on("click", function () {
                    window.location.href = "/dashboard";
                });
            },
            error: function (xhr, status, error) {
                $("#withdrawMainModalSubmitBtn").prop("disabled", false);
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
    $("#withdrawMainAmountAll").on("change", function () {
        handleMainWithdrawAmountAll();
    });

    // cashback Withdraw Amount
    $("body").on("input", "#withdrawMainAmount", function () {
        var value = Number(
            $(this)
                .val()
                .replace(/[^0-9]/g, "")
        );
        var availableAmount = Number($(this).attr("data-amount"));

        if (availableAmount < value) {
            $("#withdraw_total_amount_error").text(
                `Withdrawal amount cannot exceed BV ${availableAmount}.`
            );
            $("#withdrawMainAmount").css("border-color", "red");
        } else {
            if (!value) {
                $("#withdraw_total_amount_error").text(
                    "Withdrawal amount is required."
                );
                $("#withdrawMainAmount").css("border-color", "red");
            } else {
                $("#withdraw_total_amount_error").text("");
                $("#withdrawMainAmount").css("border-color", "");
            }
        }

        if (value) {
            $(this).val(value);
        } else {
            $(this).val("");
        }
    });

    // transaction code
    $("#withdraw_main_transaction_pin_code").on("input", function () {
        var value = $(this).val().replace(/\D/g, "");
        console.log("hello");
        if (value.length < 5) {
            $("#withdraw_main_transaction_pin_code_error").text(
                `Please enter a valid numeric pin code with a length minimum 5 digits.`
            );
            $("#withdraw_main_transaction_pin_code").css("border-color", "red");
        } else {
            $("#withdraw_main_transaction_pin_code_error").text("");
            $("#withdraw_main_transaction_pin_code").css("border-color", "");
        }

        if (!value) {
            $("#withdraw_main_transaction_pin_code_error").text(
                "Transaction pin code is required."
            );
            $("#withdraw_main_transaction_pin_code").css("border-color", "red");
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
function handleMainWithdrawAmountAll() {
    var totalWithdrawMainAmount = $("#withdraw_main_total_income").val();
    var withdrawAmountField = document.getElementById("withdrawMainAmount");
    var withdrawAllCheckbox = document.getElementById("withdrawMainAmountAll");

    if (withdrawAllCheckbox.checked) {
        withdrawAmountField.value = parseInt(totalWithdrawMainAmount);
        var inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        withdrawAmountField.dispatchEvent(inputEvent);
        $("#withdrawMainAmount").prop("readonly", true);
        $("#withdrawMainAmount").css({
            "background-color": "#cccccc",
            cursor: "move",
        });
    } else {
        withdrawAmountField.value = "";
        $("#withdrawMainAmount").prop("readonly", false);
        $("#withdrawMainAmount").css({
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

function formatTakaWithCommas(number) {
    const formatter = new Intl.NumberFormat("en-IN", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const formattedNumber = formatter.format(number);

    return formattedNumber;
}

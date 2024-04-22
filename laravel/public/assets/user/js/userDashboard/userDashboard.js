jQuery(document).ready(function () {
    $("#refWithdrawalModal").modal("hide");
    $("#cashbackWithdrawalModal").modal("hide");
    $("#matchingWithdrawalModal").modal("hide");

    // after hidden referral modal
    $("#refWithdrawalModal").on("hidden.bs.modal", function () {
        // for ref field clear
        $("#refWithdrawAmount").val("");
        $("#refWithdrawAmountError").html("");

        // for pin code field clear
        $("#transaction_pin_code").val("");
        $("#transaction_pin_code_error").html("");
    });

    // after hidden cashback modal
    $("#cashbackWithdrawalModal").on("hidden.bs.modal", function () {
        // for cashback field clear
        $("#cashbackWithdrawAmount").val("");
        $("#cashbackWithdrawAmountError").html("");

        // for pin code field clear
        $("#transaction_pin_code").val("");
        $("#transaction_pin_code_error").html("");
    });

    // after hidden matching modal
    $("#matchingWithdrawalModal").on("hidden.bs.modal", function () {
        // for matching field clear
        $("#matchingWithdrawAmount").val("");
        $("#matchingWithdrawAmountError").html("");

        // for pin code field clear
        $("#transaction_pin_code").val("");
        $("#transaction_pin_code_error").html("");
    });

    // after click for withdrawaing referral amount
    $("#refWithdrawBtn").on("click", function () {
        var isUserTransactionPin = $("#user_transaction_pin").val();

        if (isUserTransactionPin) {
            showRefWithdrawPopup();
        } else {
            // Alert the user
            var confirmation = confirm(
                "Please set up your transaction password before withdrawing."
            );

            // Check user's response
            if (confirmation) {
                window.location.href = "/add-transaction-pin";
            }
        }
    });

    // after click for withdrawaing cashback amount
    $("#cashbackWithdrawBtn").on("click", function () {
        var isUserTransactionPin = $("#user_transaction_pin").val();

        if (isUserTransactionPin) {
            showCashbackWithdrawPopup();
        } else {
            // Alert the user
            var confirmation = confirm(
                "Please set up your transaction password before withdrawing."
            );

            // Check user's response
            if (confirmation) {
                window.location.href = "/add-transaction-pin";
            }
        }
    });

    // after click for withdrawaing matching amount
    $("#matchingWithdrawBtn").on("click", function () {
        var isUserTransactionPin = $("#user_transaction_pin").val();

        if (isUserTransactionPin) {
            showMatchingWithdrawPopup();
        } else {
            // Alert the user
            var confirmation = confirm(
                "Please set up your transaction password before withdrawing."
            );

            // Check user's response
            if (confirmation) {
                window.location.href = "/add-transaction-pin";
            }
        }
    });

    // after click for withdrawaing generation amount
    $("#generationWithdrawBtn").on("click", function () {
        var isUserTransactionPin = $("#user_transaction_pin").val();

        if (isUserTransactionPin) {
            showGenerationWithdrawPopup();
        } else {
            // Alert the user
            var confirmation = confirm(
                "Please set up your transaction password before withdrawing."
            );

            // Check user's response
            if (confirmation) {
                window.location.href = "/add-transaction-pin";
            }
        }
    });

    // show referral modal
    function showRefWithdrawPopup() {
        $("#refWithdrawalModal").modal("show");
    }

    // show cashback modal
    function showCashbackWithdrawPopup() {
        $("#cashbackWithdrawalModal").modal("show");
    }

    // show matching modal
    function showMatchingWithdrawPopup() {
        $("#matchingWithdrawalModal").modal("show");
    }

    // show generation modal
    function showGenerationWithdrawPopup() {
        $("#generationWithdrawalModal").modal("show");
    }

    // after clicking close button of modal
    $(".btn-close").on("click", function () {
        $("#refWithdrawalModal").modal("hide");
        $("#cashbackWithdrawalModal").modal("hide");
        $("#matchingWithdrawalModal").modal("hide");
        $("#generationWithdrawalModal").modal("hide");
    });
});

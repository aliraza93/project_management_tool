$(document).ready(function () {
    $("#withdrawalAmountElement").on("click", function () {
        console.log("hello");
        $.ajax({
            url: "/exist-transaction-code",
            method: "GET",
            success: function (response) {
                if (response.shouldShowCheckTransactionCodeView) {
                    window.location.href = "/withdrawal-amount";
                } else {
                    window.location.href = "/withdraw/add-transaction-pin";
                }
            },
            error: function (error) {
                console.error("Error making withdrawal API request:", error);
            },
        });
    });
});

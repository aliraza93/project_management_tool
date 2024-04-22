$(document).ready(function () {
    var userType = $("#userType").data("user-type");
    var duePurchaseRange = $("#duePurchaseRange").val();
    var duePurchaseRangeParseFloat = parseFloat($("#duePurchaseRange").val());
    var productInititalBVParseFloat = parseFloat($("#productInititalBV").val());

    if (userType == "user") {
        if (duePurchaseRangeParseFloat < productInititalBVParseFloat) {
            $("#user_checkout_submit").prop("hidden", true);
            $("#manual-payment-area").prop("hidden", true);
            $("#isExceedPurchaseRangeError").text(
                `You have exceeded the purchase range. Your available purchase BV: ${duePurchaseRange}`
            );
            $("#biiling-details").hide();
        } else {
            $("#user_checkout_submit").prop("hidden", false);
        }
    } else {
        $("#user_checkout_submit").prop("hidden", false);
    }
});

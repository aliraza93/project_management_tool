$(document).ready(function () {
    var isExistUserShippingInfo = $("#is_existing_user_shipping_info").val();
    var userType = $("#userType").data("user-type");
    var isFullName = false;
    var isMobileNo = false;
    var isEmail = false;
    var isAddress = false;
    var isPostalCode = false;
    var isDivision = false;
    var isDistrict = false;
    var isUpazilla = false;
    var isTransactionMobileNumber = false;
    var isTransactionId = false;
    var isCheckedPaymentMethod = false;
    var isSwitchedShipOrder = true;

    // check if user or admin and accountant
    if (userType == "user") {
        var totalPriceTakaString = $("#total_price").text();
        $("#shipping_bv").text(`${formatTakaWithCommas(110) + " " + "Tk"}`);

        var totalPriceTaka = parseFloat(
            totalPriceTakaString.replace(/[Tk,]/g, "")
        );

        // Add 110 to totalPriceTaka
        var newTotalPrice = totalPriceTaka + 110;

        // Update the content of the span with the new value
        $("#total_price").text(
            formatTakaWithCommas(newTotalPrice) + " " + "Tk"
        );

        $("#user_new_address_form").removeAttr("hidden");
        $("#user_checkout_submit").prop("disabled", true);

        // if click choose a pickup location
        $("#user_choose_pick_up_location").on("click", function () {
            var shippingCostValue = 0.0;
            $("#shipping_cost").val(shippingCostValue);
            $("#shipping_bv").text(
                `${formatTakaWithCommas(shippingCostValue) + " " + "Tk"}`
            );

            var totalPriceTakaString = $("#total_price").text();

            var totalPriceTaka = parseFloat(
                totalPriceTakaString.replace(/[Tk,]/g, "")
            );

            // Add 110 to totalPriceTaka
            var newTotalPrice = totalPriceTaka - 110;

            $("#total_price").text(
                formatTakaWithCommas(newTotalPrice) + " " + "Tk"
            );

            $("#user_office_location_area").removeAttr("hidden");
            $("#user_new_address_form").attr("hidden", true);
            isSwitchedShipOrder = false;
            $(".select-field").css("display", "none");
            $(".select-field").prop("disabled", true);
            $("#is_pick_up_location").val(1);
            // onchange input field value of payment info form

            $(".payment-input-field").on("input select", function () {
                var fieldName = $(this).attr("id");
                if (isClickOfficeLocationForm(fieldName)) {
                    console.log("valid666");
                    $("#user_checkout_submit").prop("disabled", false);
                } else {
                    $("#user_checkout_submit").prop("disabled", true);
                }
            });
        });

        // if click user_ship_order then
        $("#user_ship_order").on("click", function () {
            var shippingCostValue = 110;
            $("#shipping_cost").val(shippingCostValue);
            $("#shipping_bv").text(
                `${formatTakaWithCommas(shippingCostValue) + " " + "Tk"}`
            );

            var totalPriceTakaString = $("#total_price").text();
            $("#shipping_bv").text(`${formatTakaWithCommas(110) + " " + "Tk"}`);

            var totalPriceTaka = parseFloat(
                totalPriceTakaString.replace(/[Tk,]/g, "")
            );

            // Add 110 to totalPriceTaka
            var newTotalPrice = totalPriceTaka + 110;

            // Update the content of the span with the new value
            $("#total_price").text(
                formatTakaWithCommas(newTotalPrice) + " " + "Tk"
            );

            $("#user_office_location_area").attr("hidden", true);
            $("#user_new_address_form").removeAttr("hidden");
            $("#user_checkout_submit").prop("disabled", true);
            $(".select-field").css("display", "block");
            $(".select-field").prop("disabled", false);
            $("#is_pick_up_location").val(0);

            isSwitchedShipOrder = true;
        });

        if (isSwitchedShipOrder) {
            // onchange input field value of personal info form
            $(".user-checkout-input-field").on("input select", function () {
                var fieldName = $(this).attr("id");
                if (validateIsClickShipOrderInputForm(fieldName)) {
                    $("#user_checkout_submit").prop("disabled", false);
                } else {
                    $("#user_checkout_submit").prop("disabled", true);
                }
            });

            // fetch divisions data
            getDivision();

            // after on change on division dropdown then get districts
            $("#division").on("change", function () {
                const selectedDivisionId = $(this).val();
                $('select[name="district"]').val("");
                getDistrict(selectedDivisionId);
            });

            // after change district data then
            $("#district").on("change", function () {
                const selectedDistrictId = $(this).val();

                // get upazilla
                getUpazilla(selectedDistrictId);
            });
        }

        // when admin or accountant come
    } else {
    }

    function isClickOfficeLocationForm(inputField) {
        var transactionMobileNumber = $("#transaction-mobile-number").val();
        var transactionId = $("#transaction-number").val();
        var isPaymentMethodBkashSelected = $("#bkashPayment").is(":checked");
        var isPaymentMethodSNagadelected = $("#nagadPayment").is(":checked");
        var isPaymentMethodCashSelected = $("#cashPayment").is(":checked");

        // Validate transaction mobile number
        if (inputField === "transaction-mobile-number") {
            validateTransactionMobileNumber(transactionMobileNumber);
        }

        // Validate transaction Id
        if (inputField === "transaction-number") {
            validateTransactionNumber(transactionId);
        }

        // Validate payment method
        if (inputField === "bkashPayment") {
            validatePaymentMethod(
                isPaymentMethodSNagadelected,
                isPaymentMethodBkashSelected
            );
        }

        if (inputField === "nagadPayment") {
            validatePaymentMethod(
                isPaymentMethodSNagadelected,
                isPaymentMethodBkashSelected
            );
        }

        if (inputField === "cashPayment") {
            validatePaymentMethod(
                isPaymentMethodSNagadelected,
                isPaymentMethodBkashSelected,
                isPaymentMethodCashSelected
            );
        }

        if (
            isTransactionId &&
            isTransactionMobileNumber &&
            isCheckedPaymentMethod
        ) {
            return true;
        }

        return false;
    }

    // validation is click ship order form
    function validateIsClickShipOrderInputForm(inputField) {
        hasUserInputFormError = true;
        // Get input values
        var fullName = $("#full_name").val();
        var mobileNumber = $("#mobile_no").val();
        var email = $("#email").val();
        var address = $("#address").val();
        var postalCode = $("#postal_code").val();
        var division = $("#division").val();
        var district = $("#district").val();
        var upazila = $("#upazila").val();
        var transactionMobileNumber = $("#transaction-mobile-number").val();
        var transactionId = $("#transaction-number").val();
        var isPaymentMethodBkashSelected = $("#bkashPayment").is(":checked");
        var isPaymentMethodSNagadelected = $("#nagadPayment").is(":checked");
        var isPaymentMethodCashSelected = $("#cashPayment").is(":checked");

        // Validate Full Name
        if (inputField === "full_name") {
            validateFullName(fullName);
        }

        // Validate Mobile Number
        if (inputField === "mobile_no") {
            validateMobileNumber(mobileNumber);
        }

        // Validate Address Number
        if (inputField === "address") {
            validateAddress(address);
        }

        // Validate postal code
        if (inputField === "postal_code") {
            validatePostalCode(postalCode);
        }

        // Validate Email
        if (inputField === "email") {
            validateEmail(email);
        }

        // Validate Division
        if (inputField === "division") {
            validateDivision(division);
            isDistrict = false;
            isUpazilla = false;
        }

        // Validate district
        if (inputField === "district") {
            validateDistrict(district);
        }

        // Validate upazilla
        if (inputField === "upazila") {
            validateUpazilla(upazila);
        }

        // Validate transaction mobile number
        if (inputField === "transaction-mobile-number") {
            validateTransactionMobileNumber(transactionMobileNumber);
        }

        // Validate transaction Id
        if (inputField === "transaction-number") {
            validateTransactionNumber(transactionId);
        }

        // Validate payment method
        if (inputField === "bkashPayment") {
            validatePaymentMethod(
                isPaymentMethodSNagadelected,
                isPaymentMethodBkashSelected
            );
        }

        if (inputField === "nagadPayment") {
            validatePaymentMethod(
                isPaymentMethodSNagadelected,
                isPaymentMethodBkashSelected
            );
        }

        if (inputField === "cashPayment") {
            validatePaymentMethod(
                isPaymentMethodSNagadelected,
                isPaymentMethodBkashSelected,
                isPaymentMethodCashSelected
            );
        }

        if (
            isPostalCode &&
            isAddress &&
            isEmail &&
            isMobileNo &&
            isFullName &&
            isDistrict &&
            isDivision &&
            isUpazilla &&
            isTransactionId &&
            isTransactionMobileNumber &&
            isCheckedPaymentMethod
        ) {
            return true;
        }

        return false;
    }
    function validateFullName(fullName) {
        if (fullName.trim() === "") {
            setError(
                "#full_name",
                "#full_name_error",
                "Full name should not be empty."
            );
            isFullName = false;
        } else if (/\d/.test(fullName)) {
            setError(
                "#full_name",
                "#full_name_error",
                "Full name cannot contain numbers."
            );
            isFullName = false;
        } else {
            $("#full_name_error").text("").css("color", "");
            $("#full_name").css("border-color", "");
            isFullName = true;
        }
    }

    function validateMobileNumber(mobileNumber) {
        if (mobileNumber.trim() === "") {
            setError(
                "#mobile_number",
                "#mobile_number_error",
                "Mobile number should not be empty."
            );
            isMobileNo = false;
        } else if (mobileNumber.length < 11 || mobileNumber.length > 13) {
            setError(
                "#mobile_no",
                "#mobile_number_error",
                "Mobile number must be between 11 and 13 characters."
            );
            isMobileNo = false;
        } else {
            $("#mobile_number_error").text("").css("color", "");
            $("#mobile_no").css("border-color", "");
            isMobileNo = true;
        }
    }

    function validateEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            setError("#email", "#email-error", "Email should not be empty.");
            isEmail = false;
        } else if (!emailRegex.test(email)) {
            setError("#email", "#email-error", "Email address is not valid.");
            isEmail = false;
        } else {
            $("#email-error").text("").css("color", "");
            $("#email").css("border-color", "");
            isEmail = true;
        }
    }

    function validateAddress(address) {
        if (address.trim() === "") {
            setError(
                "#address",
                "#address-error",
                "Please enter your address."
            );
            isAddress = false;
        } else {
            $("#address-error").text("").css("color", "");
            $("#address").css("border-color", "");
            isAddress = true;
        }
    }

    function validatePostalCode(postalCode) {
        if (postalCode.trim() === "") {
            setError(
                "#postal_code",
                "#postal-error",
                "Postal Code should be a valid number."
            );
            isPostalCode = false;
        } else if (isNaN(postalCode)) {
            setError(
                "#postal_code",
                "#postal-error",
                "Postal Code should be a valid number."
            );
            isPostalCode = false;
        } else if (postalCode && postalCode.length > 6) {
            setError(
                "#postal_code",
                "#postal-error",
                "Postal Code cannot be more than 6 characters."
            );
            isPostalCode = false;
        } else {
            $("#postal-error").text("").css("color", "");
            $("#postal_code").css("border-color", "");
            isPostalCode = true;
        }
    }

    function validateDivision(division) {
        if (division.trim() === "") {
            setError(
                "#division",
                "#error-division",
                "Please select your division."
            );
            isDivision = false;
        } else {
            $("#error-division").text("").css("color", "");
            $("#division").css("border-color", "");
            isDivision = true;
        }
    }

    function validateDistrict(district) {
        console.log("district", district);
        if (district.trim() === "" || district.trim() == undefined) {
            setError(
                "#district",
                "#error-district",
                "Please select your district."
            );
            isDistrict = false;
        } else {
            $("#error-district").text("").css("color", "");
            $("#district").css("border-color", "");
            isDistrict = true;
        }
    }

    function validateUpazilla(upazila) {
        if (upazila.trim() === "" || upazila.trim() == undefined) {
            setError(
                "#upazila",
                "#error-upazila",
                "Please select your upazila."
            );
            isUpazilla = false;
        } else {
            $("#error-upazila").text("").css("color", "");
            $("#upazila").css("border-color", "");
            isUpazilla = true;
        }
    }

    function validateTransactionMobileNumber(transactionMobileNumber) {
        if (transactionMobileNumber.trim() === "") {
            setError(
                "#transaction-mobile-number",
                "#transaction_mobile_number_error",
                "Transaction mobile number should not be empty."
            );
            isTransactionMobileNumber = false;
        } else if (
            transactionMobileNumber.length < 11 ||
            transactionMobileNumber.length > 13
        ) {
            setError(
                "#transaction-mobile-number",
                "#transaction_mobile_number_error",
                "Transaction mobile number must be between 11 and 13 characters."
            );
            isTransactionMobileNumber = false;
        } else {
            $("#transaction_mobile_number_error").text("").css("color", "");
            $("#transaction-mobile-number").css("border-color", "");
            isTransactionMobileNumber = true;
        }
    }

    function validateTransactionNumber(transactionId) {
        if (transactionId.trim() === "") {
            setError(
                "#transaction-number",
                "#transaction_number_error",
                "Transaction ID should not be empty."
            );
            isTransactionId = false;
        } else if (transactionId.length > 20) {
            setError(
                "#transaction-number",
                "#transaction_number_error",
                "Transaction ID should include within 20 character max."
            );

            isTransactionId = false;
        } else {
            $("#transaction_number_error").text("").css("color", "");
            $("#transaction-number").css("border-color", "");
            isTransactionId = true;
        }
    }

    function validatePaymentMethod(
        isPaymentMethodBkashSelected,
        isPaymentMethodSNagadelected,
        isPaymentMethodCashSelected
    ) {
        if (
            isPaymentMethodBkashSelected ||
            isPaymentMethodSNagadelected ||
            isPaymentMethodCashSelected
        ) {
            $("#payment-method-error").text("").css("color", "");
            $("#bkashPayment").css("border-color", "");
            isCheckedPaymentMethod = true;
        } else {
            setError("#bkashPayment", "#payment-method-error", "");
            isCheckedPaymentMethod = false;
        }
    }

    function setError(fieldSelector, errorSelector, errorMessage) {
        $(errorSelector).text(errorMessage).css("color", "red");
        $(fieldSelector).css("border-color", "red");
        hasUserInputFormError = true;
    }

    // get upazilla ajax
    function getUpazilla(selectedDistrictId) {
        $.ajax({
            url: `/api/get-upazila/${selectedDistrictId}`,
            method: "GET",
            success: function (data) {
                const upazilas = data.upazilas;
                const dropdown = $("#upazila");

                dropdown.empty();

                dropdown.append(new Option("Select an upazila", ""));

                $.each(upazilas, function (index, upazila) {
                    dropdown.append(new Option(upazila.name, upazila.id));
                });
            },
            error: function (error) {
                console.error("Error fetching upazilas:", error);
            },
        });
    }

    // get district ajax
    function getDistrict(selectedDivisionId) {
        $.ajax({
            url: `/api/get-districts/${selectedDivisionId}`,
            method: "GET",
            success: function (data) {
                const districts = data.districts;
                const districDropdown = $("#district");
                const upazilaDropdown = $("#upazila");

                upazilaDropdown.empty();
                upazilaDropdown.append(new Option("Select a upazila", ""));

                districDropdown.empty();
                districDropdown.append(new Option("Select a district", ""));
                $("#district option:first").attr("disabled", "disabled");
                $("#upazila option:first").attr("disabled", "disabled");

                $.each(districts, function (index, district) {
                    districDropdown.append(
                        new Option(district.name, district.id)
                    );
                });
            },
            error: function (error) {
                console.error("Error fetching districts:", error);
            },
        });
    }

    // get division ajax
    function getDivision() {
        $.ajax({
            url: "/api/get-divisions",
            method: "GET",
            dataType: "json",
            success: function (data) {
                var divisions = data.divisions;
                var dropdown = $("#division");
                var districtDropdown = $("#district");

                $.each(divisions, function (_, division) {
                    var id = division.id;
                    var name = division.name;

                    if (!$(`#division option[value="${id}"]`).length) {
                        dropdown.append(new Option(name, id));
                    }
                });

                districtDropdown.append(new Option("Select a district", ""));

                // Add default "Select a Division" option
                if ($("#division option[value='']").length === 0) {
                    dropdown.prepend(new Option("Select a division", "", true));
                    $("#division option:first").attr("disabled", "disabled");
                }
            },
            error: function (error) {
                console.error("Error fetching divisions:", error);
            },
        });
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
});

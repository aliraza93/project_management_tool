let hasPersonalInfoErrors = false;
let hasMailingInfoErrors = false;
let isPaymentInfoErrors = false;
let hasNidErrors = false;
let isClickNextPersonalInfoButton = false;
let isClickNidInfoButton = false;
let isClickNextMailingButton = false;
let isClickCreateAccountButton = false;
let isNidAbleUse = false;
var jqOld = jQuery.noConflict();

jqOld(document).ready(function () {
    // when change value from birthdate
    $("#datepicker").focusout(function () {
        $("#datepicker").css("border-color", "");
        $("#birthdate-error").text("");
        hasPersonalInfoErrors = false;
    });

    $("#sponsor_edit_btn").hide();
    $("#sponsor_next_btn").hide();
    $("#placement_edit_btn").hide();
    $(".placement_group").hide();
    $("#bKash_button").prop("disabled", true).hide();
    $("#register-next").prop("disabled", true).hide();

    // onchange input field value of personal info form
    $(".personalInfoField").on("input", function () {
        validatePersonalInfoForm($(this), isClickNextPersonalInfoButton);
    });

    // onchange input field value of nid info form
    $(".nidInfoField").on("input", function () {
        validateNidInfoForm($(this), isClickNidInfoButton);
    });

    // onchange input field value of mailing info form
    $(".mailingInfoField").on("input", function () {
        validateMailingAddressForm($(this), isClickNextMailingButton);
    });

    // onchange input field value of payment info form
    $(".paymentInfoField").on("input", function () {
        validatePaymentInfo($(this), isClickCreateAccountButton);
    });

    var currentTab = 1;
    jQuery(".register-2, .register-3, .register-4, .register-5").hide();

    // handle click tab next button
    jQuery("body").on("click", "#register-next", function (event) {
        var placementIdInput = $("#placement_id").val();
        var sponsorIdInput = $("#sponsor_id").val();
        $("#placementId").val(placementIdInput);
        $("#sponsorId").val(sponsorIdInput);

        console.log("hasMailingInfoErrors", hasMailingInfoErrors);
        if (currentTab < 5) {
            event.preventDefault();
            if (currentTab == 2) {
                isClickNidInfoButton = true;

                if (
                    validateNidInfoForm(null, isClickNidInfoButton) &&
                    !hasNidErrors &&
                    isNidAbleUse
                ) {
                    currentTab++;
                    jQuery(".register").hide();
                    jQuery(`.register-${currentTab}`).show();
                }
            } else if (currentTab === 3) {
                isClickNextPersonalInfoButton = true;
                console.log("checkPersonalInfo", checkPersonalInfo());
                checkPersonalInfo().then(function (isPersonalInfoValid) {
                    if (
                        isPersonalInfoValid &&
                        validatePersonalInfoForm(
                            null,
                            isClickNextPersonalInfoButton
                        ) &&
                        !hasPersonalInfoErrors
                    ) {
                        currentTab++;
                        jQuery(".register").hide();
                        jQuery(`.register-${currentTab}`).show();
                    }
                });
            } else if (currentTab === 4) {
                $("#bkashPayment").prop("checked", true);
                isClickNextMailingButton = true;
                var availableNidUse = $("#available_nid_use").val();

                $(".package-card").each(function () {
                    var packageNoIds = $(this).data("package-depth-id");
                    var isSelectable = packageNoIds <= availableNidUse;

                    if (!isSelectable) {
                        $(this)
                            .addClass("disabled")
                            .css("background-color", "#f2f2f2");
                        $(this)
                            .find(".select-package-btn")
                            .prop("disabled", true);
                    }
                });

                if (
                    $(this).hasClass("existing-nid") ||
                    (validateMailingAddressForm(
                        null,
                        isClickNextMailingButton
                    ) &&
                        !hasMailingInfoErrors)
                ) {
                    $("#register-next").prop("disabled", true);
                    $("#data-width").css("width", "100%");
                    currentTab++;
                    jQuery(".register").hide();
                    jQuery(`.register-${currentTab}`).show();
                }
            } else {
                currentTab++;
                jQuery(".register").hide();
                jQuery(`.register-${currentTab}`).show();
            }
        } else if (currentTab == 5) {
            isClickCreateAccountButton = true;

            if (
                validatePaymentInfo(null, isClickCreateAccountButton) &&
                !isPaymentInfoErrors
            ) {
                $("#registrationForm").submit();
            }
        }
    });

    // handle click tab prev button
    jQuery("body").on("click", "#register-prev", function (event) {
        event.preventDefault();
        $(".mailingInfoField").css("border-color", "");
        currentTab--;
        jQuery(".register").hide();
        jQuery(`.register-${currentTab}`).show();
    });

    // handle click Sponsor apply button
    jQuery("body").on("click", "#sponsor_apply_btn", function () {
        console.log("hello");
        var sponsorInputField = $("#sponsor_id").val();
        var errorDiv = $(".sponsor_error_message");

        if (!sponsorInputField.trim()) {
            errorDiv.text("Enter a valid sponsor ID.").show();

            errorDiv.css("color", "red");
            $("#sponsor_id").css("border-color", "red");
            return;
        }

        if (sponsorInputField.length !== 9) {
            errorDiv.text("Sponsor ID must be exactly 9 characters.").show();
            errorDiv.css("color", "red");

            $("#sponsor_id").css("border-color", "red");
            return;
        }

        errorDiv.text("");
        $("#sponsor_id").css("border-color", "");
        checkSponsorId();
    });

    // handle click Sponsor edit button
    jQuery("body").on("click", "#sponsor_edit_btn", function () {
        var applyButton = $("#sponsor_apply_btn");
        var editButton = $("#sponsor_edit_btn");
        var sponsorIdInput = $("#sponsor_id");
        var successDiv = $(".sponsor_success_message");
        var errorDiv = $(".sponsor_error_message");
        var sponsorDiv = $(".sponsor-div");
        $("#sponsor_next_btn").hide();

        $("#register-next").prop("disabled", true).hide();
        sponsorDiv.show();
        successDiv.hide();
        errorDiv.hide();
        editButton.hide();
        applyButton
            .text("Check")
            .prop("disabled", false)
            .css("width", "70px")
            .show();
        $(".placement_group").hide();
        $("#sponsorOptionRadioContainer").hide();
        $("#sponsorLeftMessageContainer").hide();
        $("#sponsorRightMessageContainer").hide();
        $("#sponsorBookedMessageContainer").hide();
        $("#legRightPosition").prop("checked", false);
        $("#legLeftPosition").prop("checked", false);

        sponsorIdInput.prop("disabled", false);
    });

    // handle click Sponsor next button
    jQuery("body").on("click", "#sponsor_next_btn", function () {
        var editButton = $("#sponsor_edit_btn");
        var successDiv = $(".sponsor_success_message");
        var errorDiv = $(".sponsor_error_message");
        var sponsorDiv = $(".sponsor-div");

        $(".placement_group").show();
        $("#register-next").prop("disabled", true).hide();
        sponsorDiv.hide();
        successDiv.hide();
        errorDiv.hide();
        editButton.hide();
        $("#sponsor_next_btn").hide();

        $("#sponsorOptionRadioContainer").hide();
        $("#sponsorLeftMessageContainer").hide();
        $("#sponsorRightMessageContainer").hide();
        $("#sponsorBookedMessageContainer").hide();
        $("#legRightPosition").prop("checked", false);
        $("#legLeftPosition").prop("checked", false);
        $("input[type='radio']").prop("checked", false);
    });

    // handle click placement apply button
    jQuery("body").on("click", "#placement_apply_btn", function () {
        var placementInputField = $("#placement_id").val();
        var errorDiv = $(".placement_error_message");

        if (!placementInputField.trim()) {
            errorDiv.text("Enter a valid Placement ID.").show();

            errorDiv.css("color", "red");
            $("#placement_id").css("border-color", "red");
            return;
        }

        if (placementInputField.length !== 9) {
            errorDiv.text("Placement ID must be exactly 9 characters.").show();
            errorDiv.css("color", "red");

            $("#placement_id").css("border-color", "red");
            return;
        }

        errorDiv.text("");
        $("#placement_id").css("border-color", "");
        checkPlacementId();
    });

    // handle click placement edit button
    jQuery("body").on("click", "#placement_edit_btn", function () {
        var applyButton = $("#placement_apply_btn");
        var editButton = $("#placement_edit_btn");
        var placementIdInput = $("#placement_id");
        var successDiv = $(".placement_success_message");
        var errorDiv = $(".placement_error_message");
        $(".placement_group").show();
        $("#register-next").prop("disabled", true).hide();
        successDiv.hide();
        errorDiv.hide();
        editButton.hide();
        applyButton
            .text("Check")
            .prop("disabled", false)
            .css("width", "70px")
            .show();
        $("#sponsorOptionRadioContainer").hide();
        $("#sponsorLeftMessageContainer").hide();
        $("#sponsorRightMessageContainer").hide();
        $("#sponsorBookedMessageContainer").hide();
        $("#legRightPosition").prop("checked", false);
        $("#legLeftPosition").prop("checked", false);

        $("input[type='radio']").prop("checked", false);

        placementIdInput.prop("disabled", false);
    });

    // onchange event of leg option
    $("#legRightPosition, #legLeftPosition").on("change", function () {
        var legPosition = $(this).val();
        var registerButton = $("#register-next");

        if (legPosition) {
            registerButton.prop("disabled", false).show();
        } else {
            registerButton.prop("disabled", true);
        }
    });

    // fetch upazilas data
    $("#district").on("change", function () {
        const selectedDistrictId = $(this).val();

        $.ajax({
            url: `/api/get-upazila/${selectedDistrictId}`,
            method: "GET",
            success: function (data) {
                const upazilas = data.upazilas;
                const dropdown = $("#upazila");

                dropdown.empty();

                dropdown.append(new Option("Select a upazila", ""));

                $.each(upazilas, function (index, upazila) {
                    dropdown.append(new Option(upazila.name, upazila.id));
                });
            },
            error: function (error) {
                console.error("Error fetching upazilas:", error);
            },
        });
    });

    // fetch district data
    $("#division").on("change", function () {
        const selectedDivisionId = $(this).val();

        $.ajax({
            url: `/api/get-districts/${selectedDivisionId}`,
            method: "GET",
            success: function (data) {
                const districts = data.districts;
                const dropdown = $("#district");
                console.log("districts", districts);
                dropdown.empty();

                dropdown.append(new Option("Select a district", ""));

                $.each(districts, function (index, district) {
                    dropdown.append(new Option(district.name, district.id));
                });
            },
            error: function (error) {
                console.error("Error fetching districts:", error);
            },
        });
    });

    // fetch divisions data
    $.ajax({
        url: "/api/get-divisions",
        method: "GET",
        dataType: "json",
        success: function (data) {
            var divisions = data.divisions;
            var dropdown = $("#division");

            $.each(divisions, function (_, division) {
                var id = division.id;
                var name = division.name;

                dropdown.append(new Option(name, id));
            });
        },
        error: function (error) {
            console.error("Error fetching divisions:", error);
        },
    });

    // // check email address condition
    // $("#register_email").on("blur", function () {
    //     var email = $(this).val();

    //     var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    //     if (email && emailRegex.test(email)) {
    //         checkEmailAddress(email);
    //     }
    // });

    // check NID number condition
    $("#nid-number").on("blur", function () {
        var nid = $(this).val();
        if (nid) {
            checkNid(nid);
        }
    });

    // after selecting a package
    $(".select-package-btn").on("click", function () {
        var availableNidUse = $("#available_nid_use").val();
        var packagedepthId = $(this)
            .closest(".package-card")
            .data("package-depth-id");

        if (packagedepthId <= availableNidUse) {
            // Remove "selected" class and change background color from all cards
            $(".package-card")
                .removeClass("selected")
                .css("background-color", "");
            $(".select-package-btn").text("Select").prop("disabled", false);

            var packageId = $(this).closest(".package-card").data("package-id");
            var packageBv = $(this).closest(".package-card").data("package-bv");
            var packageTk = $(this).closest(".package-card").data("package-tk");
            var unitPrice = $(this)
                .closest(".package-card")
                .data("package-unit-price");
            var discount = $(this)
                .closest(".package-card")
                .data("package-discount");
            var vat = $(this).closest(".package-card").data("package-vat");
            var price = $(this).closest(".package-card").data("package-price");
            console.log("packageBv", packageBv);
            var packageDepth = $(this)
                .closest(".package-card")
                .data("package-depth");
            var totalPrice = $(this)
                .closest(".package-card")
                .data("package-price");
            var packageName = $(this)
                .closest(".package-card")
                .data("package-name");

            $("#payment-summary").removeAttr("hidden");
            const numericPrice = parseFloat(price.replace(/,/g, ""));
            // set payable summary box
            $("#summary-unit-price").text(formatTakaWithCommas(unitPrice));
            $("#summary-vat").text(formatTakaWithCommas(vat));
            $("#summary-discount").text(formatTakaWithCommas(discount));
            $("#summary-payable").text(formatTakaWithCommas(numericPrice));

            // Set values in hidden input fields
            $("#package_depth").val(packageDepth);
            $("#package_id").val(packageId);
            $("#package_bv").val(packageBv);
            $("#package_tk").val(packageTk);
            $("#package_name").val(packageName);

            $("#total_price").val(totalPrice);

            $(this)
                .closest(".package-card")
                .addClass("selected")
                .css("background-color", "#e6f7ff");

            // Change the text of the selected button and disable it
            $(this).text("Selected").prop("disabled", true);

            // Enable bKash button
            // $("#bKash_button")
            //     .removeClass("disabled")
            //     .prop("disabled", false)
            //     .show();
            validatePaymentInfo($("#package_id"), isClickCreateAccountButton);

            $("#manual-payment-area").removeAttr("hidden");
        }
    });
});

function validatePersonalInfoForm(inputField, isClickNextPersonalInfoButton) {
    $(".error-message").text("").css("color", "");

    $(".personalInfoField").css("border-color", "");

    // Reset the error flag for each input field validation
    hasPersonalInfoErrors = false;

    // Get input values

    // Get input values
    var fullName = $("#full-name").val();
    var mobileNumber = $("#mobile-number").val();
    var email = $("#register_email").val();
    var password = $("#register_password").val();
    var confirmPassword = $("#password-confirm").val();
    // var nid = $("#nid-number").val();
    var birthDate = new Date($(".bDate").val());
    // Validate Full Name
    if (isClickNextPersonalInfoButton) {
        validateFullName(fullName);
        validateMobileNumber(mobileNumber);

        validateEmail(email);
        validatePassword(password);
        validateConfirmPassword(confirmPassword, password);
        validateBirthDate(birthDate);
    } else {
        var fieldName = inputField.attr("id");
        if (fieldName === "full-name") {
            validateFullName(fullName);
        }

        // Validate Mobile Number
        if (fieldName === "mobile-number") {
            validateMobileNumber(mobileNumber);
        }

        // Validate birthdate
        if (fieldName === "birthdate") {
            validateBirthDate(birthDate);
        }

        // Validate Email
        if (fieldName === "register_email") {
            validateEmail(email);
        }

        // Validate Password
        if (fieldName === "register_password") {
            validatePassword(password);
        }

        // Validate Confirm Password
        if (fieldName === "password-confirm") {
            validateConfirmPassword(confirmPassword, password);
        }
    }
    console.log("hasPersonalInfoErrors", hasPersonalInfoErrors);

    if (hasPersonalInfoErrors) {
        return false;
    }

    return true;
}

function validateNidInfoForm(inputField, isClickNidInfoButton) {
    $(".error-message").text("").css("color", "");

    $(".nidInfoField").css("border-color", "");

    // Reset the error flag for each input field validation
    hasNidErrors = false;

    // Get input values
    var nid = $("#nid-number").val();

    // Validate Full Name
    if (isClickNidInfoButton) {
        validateNid(nid);
    } else {
        var fieldName = inputField.attr("id");
        // // Validate NID Number
        if (fieldName === "nid-number") {
            validateNid(nid);
        }
    }
    if (hasNidErrors) {
        return false;
    }

    return true;
}

function validateFullName(fullName) {
    if (/\d/.test(fullName)) {
        setError(
            "#full-name",
            "#full-name-error",
            "Full name cannot contain numbers."
        );
    }

    if (fullName.trim() === "") {
        setError(
            "#full-name",
            "#full-name-error",
            "Full name should not be empty."
        );
    }
}

function validateMobileNumber(mobileNumber) {
    if (mobileNumber.length < 11 || mobileNumber.length > 13) {
        setError(
            "#mobile-number",
            "#mobile-number-error",
            "Mobile number must be between 11 and 13 characters."
        );
    }

    if (mobileNumber.trim() === "") {
        setError(
            "#mobile-number",
            "#mobile-number-error",
            "Mobile number should not be empty."
        );
    }
}

function validateNid(nid) {
    if (nid.trim() === "") {
        setNidError(
            "#nid-number",
            "#nid-number-error",
            "NID should not be empty."
        );
    } else if (nid.length < 10) {
        setNidError(
            "#nid-number",
            "#nid-number-error",
            "NID number must be at least 10 characters."
        );
    } else if (nid.length > 17) {
        setNidError(
            "#nid-number",
            "#nid-number-error",
            "NID number cannot be more than 17 characters."
        );
    } else {
        checkNid(nid);
    }
}

function validateBirthDate(birthDate) {
    if (birthDate == "Invalid Date") {
        setError(
            "#datepicker",
            "#birthdate-error",
            "Please enter a valid birth date."
        );
    }
}

function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
        setError(
            "#register_email",
            "#email-error",
            "Email should not be empty."
        );
    } else if (!emailRegex.test(email)) {
        setError(
            "#register_email",
            "#email-error",
            "Email address is not valid."
        );
    }
}

function validatePassword(password) {
    const strongPasswordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (password.trim() !== "") {
        if (!strongPasswordRegex.test(password)) {
            setError(
                "#register_password",
                "#password-error",
                "Password should contain at least one numeric digit, one alphabet, one special character."
            );
        }
    }

    if (password.length > 20 || password.length < 8) {
        setError(
            "#register_password",
            "#password-error",
            "Password must be between 8 and 20 characters."
        );
    }

    if (password.trim() === "") {
        setError(
            "#register_password",
            "#password-error",
            "Password should not be empty."
        );
    }
}

function validateConfirmPassword(confirmPassword, password) {
    if (confirmPassword !== password) {
        setError(
            "#password-confirm",
            "#confirm-password-error",
            "Confirm password must match the password."
        );
    } else if (confirmPassword.trim() === "") {
        setError(
            "#password-confirm",
            "#confirm-password-error",
            "Confirm password should not be empty."
        );
    }
}

function setError(fieldSelector, errorSelector, errorMessage) {
    $(errorSelector).text(errorMessage).css("color", "red");
    $(fieldSelector).css("border-color", "red");
    hasPersonalInfoErrors = true;
}

function setNidError(fieldSelector, errorSelector, errorMessage) {
    $(errorSelector).text(errorMessage).css("color", "red");
    $(fieldSelector).css("border-color", "red");
    hasNidErrors = true;
}

function validateMailingAddressForm(inputField, isClickNextMailingButton) {
    $(".error-message").text("").css("color", "");
    $(".mailingInfoField").css("border-color", "");

    hasMailingInfoErrors = false;
    // Get input values
    var addressLine = $("#address_line").val();
    var division = $("#division").val();
    var district = $("#district").val();
    var upazila = $("#upazila").val();
    var postalCode = $("#postal_code").val();
    console.log("district", district);
    // Flag to track if there are any errors

    if (isClickNextMailingButton) {
        // Validate Address Line
        if (addressLine.trim() === "") {
            $("#address-line-error").text("Address Line should not be empty.");
            $("#address_line").css("border-color", "red");
            hasMailingInfoErrors = true;
        } else {
            $("#address-line-error").text("");
        }

        // Validate Division
        if (division === null) {
            $("#division-error").text("Please select a division.");
            $("#division").css("border-color", "red");
            hasMailingInfoErrors = true;
        } else {
            $("#division-error").text("");
        }

        // Validate District
        if (!district) {
            $("#district-error").text("Please select a district.");
            $("#district").css("border-color", "red");
            hasMailingInfoErrors = true;
        } else {
            $("#district-error").text("");
        }

        // Validate Upazila
        if (!upazila) {
            $("#upazila-error").text("Please select an upazila.");
            $("#upazila").css("border-color", "red");
            hasMailingInfoErrors = true;
        } else {
            $("#upazila-error").text("");
        }

        // Validate Postal Code
        if (postalCode.trim() === "") {
            $("#postal-code-error").text("Postal Code should not be empty.");
            $("#postal_code").css("border-color", "red");
            hasMailingInfoErrors = true;
        } else if (isNaN(postalCode)) {
            $("#postal-code-error").text(
                "Postal Code should be a valid number."
            );
            $("#postal_code").css("border-color", "red");
            hasMailingInfoErrors = true;
        } else if (postalCode && postalCode.length > 6) {
            $("#postal-code-error").text(
                "Postal Code cannot be more than 6 characters."
            );
            $("#postal_code").css("border-color", "red");
            hasMailingInfoErrors = true;
        } else {
            $("#postal-code-error").text("");
        }
    } else {
        var fieldName = inputField.attr("id");
        // Validate Address Line
        if (fieldName === "address_line") {
            if (addressLine.trim() === "") {
                $("#address-line-error").text(
                    "Address Line should not be empty."
                );
                $("#address_line").css("border-color", "red");
                hasMailingInfoErrors = true;
            }
        }

        // Validate Division
        if (fieldName === "division") {
            if (division === null) {
                $("#division-error").text("Please select a division.");
                $("#division").css("border-color", "red");
                hasMailingInfoErrors = true;
            }
        }

        // Validate District
        if (fieldName === "district") {
            if (district === null) {
                $("#district-error").text("Please select a district.");
                $("#district").css("border-color", "red");
                hasMailingInfoErrors = true;
            }
        }
        // Validate Upazila
        if (fieldName === "upazila") {
            if (upazila === null) {
                $("#upazila-error").text("Please select an upazila.");
                $("#upazila").css("border-color", "red");
                hasMailingInfoErrors = true;
            }
        }
        // Validate Postal Code
        if (fieldName === "postal_code") {
            if (postalCode.trim() === "") {
                $("#postal-code-error").text(
                    "Postal Code should not be empty."
                );
                $("#postal_code").css("border-color", "red");
                hasMailingInfoErrors = true;
            } else if (isNaN(postalCode)) {
                $("#postal-code-error").text(
                    "Postal Code should be a valid number."
                );
                $("#postal_code").css("border-color", "red");
                hasMailingInfoErrors = true;
            }
        }
    }

    return !hasMailingInfoErrors;
}

// validate payment info
function validatePaymentInfo(inputField, clickedCreateAccountBtn) {
    $(".error-message").text("").css("color", "");
    $(".paymentInfoField").css("border-color", "");

    isPaymentInfoErrors = false;
    // Get input values
    var transactionNumber = $("#transaction-number").val();
    var transactionMobileNumber = $("#transaction-mobile-number").val();
    var paymentMethod = $('input[name="manual_payment_method"]:checked').val();
    var isTermsConditionChecked = $(
        'input[id="terms-condition"]:checked'
    ).val();
    var isPackageSelect = $("#package_id").val();

    if (paymentMethod == 3) {
        $("#isHide1").hide();
        $("#isHide2").hide();
        $("#transaction-mobile-number").removeAttr("required");
        $("#transaction-number").removeAttr("required");
    } else {
        $("#isHide1").show();
        $("#isHide2").show();
        $("#transaction-mobile-number").attr("required", "required");
        $("#transaction-number").attr("required", "required");
    }

    if (clickedCreateAccountBtn) {
        // Flag to track if there are any errors
        if (!paymentMethod) {
            $("#payment-method-error").text("Please select payment method.");
            isPaymentInfoErrors = true;
        } else {
            $("#payment-method-error").text("");
        }

        if (!isTermsConditionChecked) {
            $("#terms-error").text(
                "You should agree with our Terms & Condition."
            );

            isPaymentInfoErrors = true;
        } else {
            $("#terms-error").text("");
        }

        if (!isPackageSelect) {
            $("#package-error").text("Please select a pacakge.");

            isPaymentInfoErrors = true;
        } else {
            $("#package-error").text("");
        }

        if (paymentMethod !== 3) {
            // Validate transaction Number
            if (transactionNumber.trim() === "") {
                $("#transaction-number-error").text(
                    "Transaction ID should not be empty."
                );
                $("#transaction-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else if (transactionNumber.length > 20) {
                $("#transaction-number-error").text(
                    "Transaction ID should be max 20 characters."
                );
                $("#transaction-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else {
                $("#transaction-number-error").text("");
            }

            // Validate transaction mobile Number
            if (transactionMobileNumber.trim() === "") {
                $("#transaction_mobile-number-error").text(
                    "Transaction mobile number should not be empty."
                );
                $("#transaction-mobile-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else if (!/^\d+$/.test(transactionMobileNumber)) {
                $("#transaction_mobile-number-error").text(
                    "Transaction mobile number should contain only numbers."
                );
                $("#transaction-mobile-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else if (transactionMobileNumber.length > 13) {
                $("#transaction_mobile-number-error").text(
                    "Transaction mobile number should be max 13 characters."
                );
                $("#transaction-mobile-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else {
                $("#transaction_mobile-number-error").text("");
            }
        }
    } else {
        var fieldName = inputField.attr("id");
        // Validate Address Line

        if (fieldName === "transaction-number") {
            if (transactionNumber === null) {
                $("#transaction-number-error").text(
                    "Transaction ID should not be empty."
                );
                $("#transaction-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else if (transactionNumber.length > 20) {
                $("#transaction-number-error").text(
                    "Transaction ID should be max 20 characters."
                );
                $("#transaction-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            }
        }

        if (fieldName === "transaction-mobile-number") {
            if (transactionMobileNumber.trim() === "") {
                $("#transaction_mobile-number-error").text(
                    "Transaction mobile number should not be empty."
                );
                $("#transaction-mobile-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else if (!/^\d+$/.test(transactionMobileNumber)) {
                $("#transaction_mobile-number-error").text(
                    "Transaction mobile number should contain only numbers."
                );
                $("#transaction-mobile-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            } else if (transactionMobileNumber.length > 13) {
                $("#transaction_mobile-number-error").text(
                    "Transaction mobile number should be max 13 characters."
                );
                $("#transaction-mobile-number").css("border-color", "red");
                isPaymentInfoErrors = true;
            }
        }

        if (fieldName === "bkashPayment" || fieldName === "nagadPayment") {
            if (!paymentMethod) {
                $("#payment-method-error").text(
                    "Please select payment method."
                );
                isPaymentInfoErrors = true;
            }
        }

        if (fieldName === "terms-condition") {
            if (!isTermsConditionChecked) {
                $("#terms-error").text(
                    "You should agree with our Terms & Condition."
                );

                isPaymentInfoErrors = true;
            }
        }

        if (fieldName === "package_id") {
            if (!isPackageSelect) {
                $("#package-error").text("Please select a package.");

                isPaymentInfoErrors = true;
            }
        }
    }

    return !isPaymentInfoErrors;
}

// check email address condition
// function checkEmailAddress(email) {
//     $.ajax({
//         url: `/api/check-email/${email}`,
//         method: "GET",
//         headers: {
//             "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
//         },
//         success: function (response) {
//             console.log("Email is unique.");
//             $("#email-error").hide();
//             $("#register_email").css("border-color", "");
//             hasPersonalInfoErrors = false;
//         },
//         error: function (error) {
//             $("#email-error").text("Email address already been used.").show();
//             $("#email-error").css("color", "red");
//             $("#register_email").css("border-color", "red");
//             hasPersonalInfoErrors = true;
//         },
//     });
// }

// check nid condition
function checkNid(nid) {
    var sponsorId = $("#sponsor_id").val();

    $.ajax({
        url: `/api/check-nid/${nid}/${sponsorId}`,
        method: "GET",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {
            $("#available_nid_use").val(response.isAvailableNidUse);
            $("#nid-number-error").text("");
            $("#nid-number").css("border-color", "");
            var fullName = $("#full-name");
            var mobileNumber = $("#mobile-number");
            var email = $("#register_email");
            var address_line = $("#address_line");
            var division = $("#division");
            var district = $("#district");
            var upazila = $("#upazila");
            var postal_code = $("#postal_code");
            $(".register-process").removeClass("existing-nid");
            if (response.user) {
                console.log("11111");
                $(".register-process").addClass("existing-nid");
                fullName.val(response.user.name).prop("readonly", true);
                mobileNumber
                    .val(response.user.mobile_no)
                    .prop("readonly", true);
                email.val(response.user.email).prop("readonly", true);
                postal_code
                    .val(response.user.postal_code)
                    .prop("readonly", true);
                address_line
                    .val(response.user.address_line)
                    .prop("readonly", true);
                division
                    .append(
                        '<option value="' +
                            response.user.division_id +
                            '" selected readonly>' +
                            response.user.division_name +
                            "</option>"
                    )
                    .val(response.user.division_id)
                    .prop("readonly", true);
                district
                    .append(
                        '<option value="' +
                            response.user.district_id +
                            '" selected readonly>' +
                            response.user.district_name +
                            "</option>"
                    )
                    .val(response.user.district_id)
                    .prop("readonly", true);
                upazila
                    .append(
                        '<option value="' +
                            response.user.upazila_id +
                            '" selected readonly>' +
                            response.user.upazila_name +
                            "</option>"
                    )
                    .val(response.user.upazila_id)
                    .prop("readonly", true);

                $("#datepicker").attr("value", response.user.dob);
                // jqOld("#datepicker").removeAttr("id");
            } else {
                console.log("2222");
                fullName.removeAttr("readonly").val("");
                mobileNumber.removeAttr("readonly").val("");
                email.removeAttr("readonly").val("");
                postal_code.removeAttr("readonly").val("");
                address_line.removeAttr("readonly").val("");
                var divisionsAppended = false;

                // Function to populate division options
                function populateDivisions(data) {
                    var divisions = data.divisions;
                    var dropdown = $("#division");
                    dropdown.empty(); // Clear existing options

                    // Append default option if not already appended
                    if (!divisionsAppended) {
                        dropdown.append(
                            '<option value="" selected disabled>Select a division</option>'
                        );
                        divisionsAppended = true; // Mark options as appended
                    }

                    // Append division options
                    $.each(divisions, function (_, division) {
                        var id = division.id;
                        var name = division.name;
                        dropdown.append(new Option(name, id));
                    });
                }

                // Fetch divisions only if options have not been appended before
                if (!divisionsAppended) {
                    $.ajax({
                        url: "/api/get-divisions",
                        method: "GET",
                        dataType: "json",
                        success: function (data) {
                            populateDivisions(data);
                        },
                        error: function (error) {
                            console.error("Error fetching divisions:", error);
                        },
                    });
                }

                // Enable the dropdowns and set datepicker id
                division.prop("disabled", false);
                district
                    .empty()
                    .append(
                        '<option value="" selected disabled>Select a district</option>'
                    )
                    .prop("disabled", false);
                upazila
                    .empty()
                    .append(
                        '<option value="" selected disabled>Select an upazila</option>'
                    )
                    .prop("disabled", false);

                $(".bDate").attr("id", "datepicker");
            }

            hasNidErrors = false;
            isNidAbleUse = true;
        },
        error: function (error) {
            if (error.responseJSON.isAbletoUse == 1) {
                // Display the error message
                $("#nid-number-error").text(error.responseJSON.error).show();
                var auth = $("#exist_auth").val();
                // Create an anchor element

                if (auth) {
                    var changeLink = $("<a>")
                        .text("Change")
                        .attr("href", "/register-user")
                        .addClass("btn btn-solid p-1");
                } else {
                    var changeLink = $("<a>")
                        .text("Change")
                        .attr("href", "/register-process")
                        .addClass("btn btn-solid p-1");
                }

                // Apply margin-left using CSS
                changeLink.css("margin-left", "10px");

                // Add a click event listener to the anchor
                changeLink.on("click", function () {
                    // Show the register tab
                    $('a[href="#register"]').tab("show");
                });

                // Append the anchor to the error message area
                $("#nid-number-error").append(changeLink);
            } else {
                $("#nid-number-error").text(error.responseJSON.error).show();
            }

            $("#nid-number-error").css("color", "red");
            $("#nid-number").css("border-color", "red");
            hasNidErrors = true;
            isNidAbleUse = false;
        },
    });
}

function checkPersonalInfo() {
    return new Promise(function (resolve, reject) {
        var name = $("#full-name").val();
        var mobile_no = $("#mobile-number").val();
        var email = $("#register_email").val();
        var nid = $("#nid-number").val();

        $.ajax({
            url: `/register/check-personal-info/${nid}/${email}/${name}/${mobile_no}`,
            method: "GET",
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
            },
            success: function (response) {
                resolve(true);
            },
            error: function (xhr, status, error) {
                var errors = xhr.responseJSON.errors;

                $.each(errors, function (field, message) {
                    if (field === "name") {
                        setError(
                            "#full-name",
                            "#full-name-error",
                            "Name does not match with your previous account."
                        );
                    } else if (field === "email") {
                        setError(
                            "#register_email",
                            "#email-error",
                            "Email does not match with your previous account."
                        );
                    } else if (field === "mobile_no") {
                        setError(
                            "#mobile-number",
                            "#mobile-number-error",
                            "Mobile number does not match with your previous account."
                        );
                    }
                });

                resolve(false);
            },
        });
    });
}

// check sponsor id condition
function checkSponsorId() {
    var sponsorId = $("#sponsor_id").val();
    var sponsorIdInput = $("#sponsor_id");
    var applyButton = $("#sponsor_apply_btn");
    var editButton = $("#sponsor_edit_btn");
    var successDiv = $(".sponsor_success_message");
    var errorDiv = $(".sponsor_error_message");
    var placementApplyButton = $("#placement_apply_btn");
    var placementEditButton = $("#placement_edit_btn");
    var placementSuccessDiv = $(".placement_success_message");
    var placementErrorDiv = $(".placement_error_message");
    var placementIdInput = $("#placement_id");
    var sponsorNextBtn = $("#sponsor_next_btn");
    var sponsorDiv = $(".sponsor-div");

    sponsorIdInput.prop("disabled", true);

    applyButton.text("Checking...").prop("disabled", true).css("width", "20%");

    $.ajax({
        url: `/api/check-sponsor-id/${sponsorId}`,
        method: "GET",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {
            applyButton.hide();
            editButton.show();
            placementEditButton.hide();

            placementApplyButton
                .text("Check")
                .prop("disabled", false)
                .css("width", "70px")
                .show();
            placementSuccessDiv.hide();
            sponsorDiv.hide();
            sponsorNextBtn.show();

            placementIdInput.prop("disabled", false);
            successDiv
                .html(
                    `Your sponsor will be:<br><strong style="font-size: 1.2em;">${response.user_name}</strong><br>` +
                        `ID# <strong>${response.sponsor_id}</strong><br>Select "<strong style="font-size: 1.2em;">Change</strong>" to choose a different sponsor.`
                )
                .show();

            successDiv;
        },
        error: function (error) {
            console.error("API Error:", error);
            applyButton.hide();
            editButton.show();
            sponsorDiv.hide();
            errorDiv
                .text("Sponsor ID does not match. Try with another sponsor ID.")
                .show();
            errorDiv.css("color", "red");
        },
    });
}

// check placement id condition
function checkPlacementId() {
    var placementId = $("#placement_id").val();
    var placementIdInput = $("#placement_id");
    var applyButton = $("#placement_apply_btn");
    var editButton = $("#placement_edit_btn");
    var successDiv = $(".placement_success_message");
    var errorDiv = $(".placement_error_message");

    placementIdInput.prop("disabled", true);

    applyButton.text("Checking...").prop("disabled", true).css("width", "20%");

    $.ajax({
        url: `/api/check-placement-id/${placementId}`,
        method: "GET",
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
        success: function (response) {
            applyButton.hide();
            editButton.show();
            $(".placement_group").hide();
            var isFreeLegOption = response.isFreeLegOption;

            successDiv
                .html(
                    `Your placement will be:<br><strong style="font-size: 1.2em;">${response.user_name}</strong><br>` +
                        `ID# <strong>${response.identity}</strong><br>Select "<strong style="font-size: 1.2em;">Change</strong>" to choose a different placement.`
                )
                .show();

            successDiv;

            // 0 -> all booked
            // 1 -> left free
            // 2 -> right free
            // 3 -> both free

            if (isFreeLegOption === 0) {
                $("#sponsorRightMessageContainer").hide();
                $("#sponsorBookedMessageContainer").show();
                $("#sponsorLeftMessageContainer").hide();
                $("#sponsorOptionRadioContainer").hide();
            } else if (isFreeLegOption === 1) {
                $("#sponsorOptionRadioContainer").hide();
                $("#sponsorBookedMessageContainer").hide();
                $("#sponsorLeftMessageContainer").show();
                $("#sponsorRightMessageContainer").hide();
            } else if (isFreeLegOption === 2) {
                $("#sponsorOptionRadioContainer").hide();
                $("#sponsorBookedMessageContainer").hide();
                $("#sponsorRightMessageContainer").show();
                $("#sponsorLeftMessageContainer").hide();
            } else {
                $("#sponsorOptionRadioContainer").show();
                $("#sponsorLeftMessageContainer").hide();
                $("#sponsorRightMessageContainer").hide();
                $("#sponsorBookedMessageContainer").hide();
            }
        },
        error: function (error) {
            console.error("API Error:", error);
            applyButton.hide();
            editButton.show();

            errorDiv
                .text(
                    "Placement ID does not match. try with another placement ID."
                )
                .show();
            errorDiv.css("color", "red");
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

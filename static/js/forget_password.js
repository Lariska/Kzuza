$("#send_forget_password_email").click(function() {
    $("#forget_password").serialize();
    $.post("/auth/forget_password", $("#forget_password").serialize());
    window.location = "/"
});
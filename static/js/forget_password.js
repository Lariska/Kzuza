$("#send_forget_password_email").click(function() {
    $.post("/auth/forget_password", $("#forget_password").serialize());
    window.location = "/";
});
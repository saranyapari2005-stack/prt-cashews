export const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 3) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "lax",
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

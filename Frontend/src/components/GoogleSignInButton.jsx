import { GoogleLogin } from "@react-oauth/google";

const GoogleSignInButton = ({ onSuccess, onError, text }) => {
  return (
    <div style={{ width: "100%" }}>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        text="signup_with"
        width={400}
      />
    </div>
  );
};

export default GoogleSignInButton;

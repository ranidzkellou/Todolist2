/* eslint-disable react/prop-types */

const Button = ({ children, onClick, type = 'button',}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
      shadow-md px-4 py-2 items-center bg-white font-light text-accent rounded-lg
      hover:bg-bluemain hover:text-white hover:scale-110 transition-all duration-200"
    >
      {children}
       </button>
  );
};

export default Button;


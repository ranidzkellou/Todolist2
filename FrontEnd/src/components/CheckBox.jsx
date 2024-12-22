/* eslint-disable react/prop-types */
import { useState } from 'react';

const Checkbox = ({size}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (

    <div className="flex items-center">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
        className={`
          h-[${size}+rem] w-[${size}+rem] 
          rounded 
          cursor-pointer
        `}
      />
    </div>
  );

};

export default Checkbox;
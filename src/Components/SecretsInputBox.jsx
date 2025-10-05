
export const SecretsInputBox = ({ inputTxt,setValueState,isForSecret=true,icon,iconFunc,isReadOnly=true,placeholder=''}) => {
    var inputText=inputTxt;

    if (isForSecret){
        inputText=`${inputTxt.slice(0, 4)}xxxxxxxxxxxxxxxx${inputTxt.slice(-4)}`
    }


    const handleChange = (e) => {
        if (!isReadOnly) {
            setValueState(e.target.value);
        }
    };
    

    return (
        <div className="flex items-center w-full bg-white/20 backdrop-blur-md rounded px-4 py-2 shadow shadow-cyan-300">
        {/* Input field */}
        <input
            type="text"
            readOnly={isReadOnly}
            onChange={handleChange}
            value={inputText}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-purple-300 font-semibold text-sm font-mono"
        />

        {/* Copy button */}
        {icon && <button onClick={()=>iconFunc(inputTxt)} className="ml-3 flex items-center">
            {icon}
        </button>}
        </div>
    )
}

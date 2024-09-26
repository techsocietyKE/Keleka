import styled from "styled-components"

const StyledButton = styled.button`
background-color:#9A9AA4;
border:0;
color:#fff;
border-radius:5px;

`
export default function PrimaryBtn({children}){
return(
    <button>
       <StyledButton>{children}</StyledButton>
    </button>
)

}
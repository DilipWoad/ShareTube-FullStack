import { createSlice } from "@reduxjs/toolkit";

const toastCardSlice = createSlice(
    {
        name:"toast",
        initialState:{
            showCard:false,
            label:null,
            cardColor:null,
            textColor:"text-white"
        },
        reducers:{
            toastCardDetail:(state,action)=>{
                console.log(action.payload)
                state.showCard=true;
                state.label=action.payload.label
                state.cardColor=action.payload.cardColor
            },
            setToastCardHidden:(state,action)=>{
                state.showCard=false;
                state.label=null;
                state.cardColor=null;
                console.log("reched here ..............")
            },
        }
    }

)

export default toastCardSlice.reducer;
export const {toastCardDetail,setToastCardHidden} = toastCardSlice.actions;
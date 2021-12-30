import React, { FC, useCallback, useEffect } from 'react';
import styled from 'styled-components';

type KnobProps = {
  label: string,
  value: number
}

const RotateGroup = styled.g`
  animation:2s linear rotation;
  transform-origin: center;
  @keyframes rotation {
    0%{ transform: rotate(-135deg); }
    100%{ transform: rotate(135deg); }
  }
`;

const Knob: FC<KnobProps> = (props): JSX.Element => {
  return (<>
    <svg width="26px" height="26px" viewBox="0 0 52 52" version="1.1" xmlns="http://www.w3.org/2000/svg" fillRule='evenodd' strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit='1.5' >
      <RotateGroup>
      <g transform="translate(1,2) matrix(1.0,0,0,1,-6.88253,-13.1812)" >
        <path d="M38.844,14.098C48.694,17.073 55.871,26.226 55.871,37.042C55.871,50.275 45.127,61.019 31.893,61.019C18.659,61.019 7.915,50.275 7.915,37.042C7.915,26.283 15.017,17.169 24.782,14.139" fill='none' stroke='rgb(255,255,255)' strokeWidth='2px' />
      </g>
      <g transform = "translate(1,0) matrix(1.0,0,0,1,-0.128832,-0.0623289)" >
        <path d="M24.361,0.947L24.361,15.153" fill='none' stroke='rgb(255,255,255)' strokeWidth='2px' />
        </g>
      </RotateGroup>
    </svg>
    <div>{props.label}: {props.value}</div>
  </>)
}

export default Knob;

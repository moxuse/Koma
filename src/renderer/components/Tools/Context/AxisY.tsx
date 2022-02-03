import * as React from 'react';
import { AxisYType } from '../../../model/Effect';

export const AxisYContext = React.createContext<{
  axisY: AxisYType;
  setAxisY: (axisY: AxisYType) => void;
}>({
      axisY: 'rate',
      setAxisY: (axisY) => {
        console.log('axisY:', axisY);
      } });

export const AxisYContextProvider: React.FC<any> = ({ children }) => {
  const [axisY, setAxisY] = React.useState<AxisYType>('rate');

  // 初期化処理
  React.useEffect(() => {
    setAxisY('rate');
  }, []);

  return (
    <AxisYContext.Provider value={{ axisY, setAxisY }}>
      {children}
    </AxisYContext.Provider>
  );
};

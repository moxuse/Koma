import * as React from "react";

export const ToolsContext = React.createContext<{
  resolution: number;
  setResolution: (resolution: number) => void;
}>({
  resolution: 50,
  setResolution: (resolution) => {
    console.log('resolution:',resolution);
  },
});

export const ToolsContextProvider: React.FC<any> = ({ children }) => {
  const [resolution, setResolution] = React.useState<number>(50);

  // 初期化処理
  React.useEffect(() => {
    setResolution(50);
  }, []);
  
  return (
    <ToolsContext.Provider value={{ resolution, setResolution }}>
      {children}
    </ToolsContext.Provider>
  );
};

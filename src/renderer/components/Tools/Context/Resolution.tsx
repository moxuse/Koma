import * as React from 'react';

export const ResolutionContext = React.createContext<{
  resolution: number;
  setResolution: (resolution: number) => void;
}>({
      resolution: 50,
      setResolution: (resolution) => {
        console.log('resolution:', resolution);
      },
    });

export const ResolutionContextProvider: React.FC<any> = ({ children }) => {
  const [resolution, setResolution] = React.useState<number>(50);

  // 初期化処理
  React.useEffect(() => {
    setResolution(50);
  }, []);

  return (
    <ResolutionContext.Provider value={{ resolution: resolution, setResolution: setResolution }}>
      {children}
    </ResolutionContext.Provider>
  );
};

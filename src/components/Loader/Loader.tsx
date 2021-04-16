import ReactLoading, { LoadingType } from "react-loading";
import React from "react";

export interface LoaderProps {
  color?: string;
  type?: LoadingType;
}

const Loader: React.SFC<LoaderProps> = ({
  color = "#000000",
  type = "spinningBubbles",
}: LoaderProps) => {
  return <ReactLoading color={color} type={type} />;
};

export default Loader;

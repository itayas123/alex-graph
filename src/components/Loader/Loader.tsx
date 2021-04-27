import ReactLoading, { LoadingType } from "react-loading";
import React from "react";

export interface LoaderProps {
  color?: string;
  type?: LoadingType;
}

const Loader: React.SFC<LoaderProps> = ({
  color = "rgb(55, 179, 115)",
  type = "spinningBubbles",
}: LoaderProps) => {
  return <ReactLoading className="loader" color={color} type={type} />;
};

export default Loader;

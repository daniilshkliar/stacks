import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import NoData from "../elements/NoData/NoData";

export const RootErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NoData text="This page doesn't exist" />;
    }
  }

  return <NoData text="Something went wrong" />;
};

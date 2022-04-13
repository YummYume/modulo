import { useQuery } from "react-query";

import { getUser } from "../user";

export const useUser = () => useQuery("user", getUser);

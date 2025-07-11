export type ApiResponse = {
  status: "success" | "error";
  message: string;
  data?: any;
  error?: string;
};

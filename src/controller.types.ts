export type Controller = (
  req: Request, res: Response, next: NextFunction
) => void

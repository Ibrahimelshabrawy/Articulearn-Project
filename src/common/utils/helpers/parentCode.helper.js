export const generate6DigitCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateUniqueParentCode = async ({db_service, userModel}) => {
  for (let i = 0; i < 30; i++) {
    const code = generate6DigitCode();

    const exists = await db_service.findOne({
      model: userModel,
      filter: {parentLinkCode: code},
      select: "_id",
      options: {lean: true},
    });

    if (!exists) return code;
  }
  throw new Error("Could not generate unique parent code", {cause: 500});
};

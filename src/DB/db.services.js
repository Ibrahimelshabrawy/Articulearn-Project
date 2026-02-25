export const create = async ({model, data, options = {}} = {}) => {
  let [doc] = await model.create([data], options);
  return doc;
};
export const findOne = async ({
  model,
  select = "",
  filter = {},
  options = {},
} = {}) => {
  let doc = model.findOne(filter).select(select);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.skip) {
    doc.skip(options.skip);
  }
  if (options?.limit) {
    doc.limit(options.limit);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
};

export const find = async ({
  model,
  select = "",
  filter = {},
  options = {},
} = {}) => {
  let doc = model.find(filter).select(select);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.sort) {
    doc.sort(options.sort);
  }
  if (options?.skip) {
    doc.skip(options.skip);
  }
  if (options?.limit) {
    doc.limit(options.limit);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
};

export const findById = async ({model, id, options = {}, select = ""} = {}) => {
  let doc = model.findById(id).select(select);
  if (options?.populate) {
    doc.populate(options.populate);
  }
  if (options?.lean) {
    doc.lean(options.lean);
  }
  return await doc.exec();
};

export const updateOne = async ({
  model,
  filter = {},
  update = {},
  options = {},
} = {}) => {
  let doc = model.updateOne(filter, update, {
    runValidators: true,
    ...options,
  });
  return await doc.exec();
};

export const findOneAndUpdate = async ({
  model,
  filter = {},
  update = {},
  options = {},
  select = "",
} = {}) => {
  let doc = model
    .findOneAndUpdate(
      filter,
      update,
      {
        new: true,
        runValidators: true,
        ...options,
      },
      select,
    )
    .select(select);
  return await doc.exec();
};
export const paginate = async ({
  filter = {},
  options = {},
  select = "",
  page = "all",
  size = 5,
  model,
} = {}) => {
  let docsCount;
  let pages;
  let currentPage;
  const isAll = page === "all" || page === undefined || page === null;
  if (!isAll) {
    const p = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.max(1, Math.min(50, parseInt(size, 10) || 5));
    options.limit = lim;
    options.skip = (p - 1) * lim;
    docsCount = await model.countDocuments(filter);
    pages = Math.ceil(docsCount / lim);
    currentPage = p;
  }
  const result = await find({model, filter, select, options});
  return {docsCount, limit: options.limit, pages, currentPage, result};
};

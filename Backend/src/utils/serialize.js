/** Chuẩn hóa document Mongo → object giống json-server (có id số) */
export function serialize(doc) {
    if (!doc) return doc;
    const o = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };
    delete o._id;
    delete o.__v;
    if (o.password) delete o.password;
    return o;
  }
  
  export function serializeMany(list) {
    return (list || []).map(serialize);
  }
  
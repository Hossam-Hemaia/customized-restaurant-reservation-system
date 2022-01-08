const { body } = require("express-validator");

module.exports = {
  validateName: body("name")
    .isString()
    .withMessage("يجب ان يتكون الاسم من احرف فقط"),
  validatePhoneNumber: body("phoneNumber")
    .isString()
    .isLength({ min: 7, max: 11 })
    .withMessage("يجب الا يقل رقم الهاتف عن 7 ارقام ولا يزيد على 11 رقم"),
  validateWeight: body("initialWeight")
    .isNumeric()
    .isInt()
    .withMessage("الوزن يجب ان يكون رقم صحيح"),
  validateHeight: body("height")
    .isNumeric()
    .isInt()
    .withMessage("الطول يجب ان يكون رقم صحيح"),
  validateAge: body("age")
    .isNumeric()
    .isInt()
    .withMessage("العمر يجب ان يكون رقم صحيح"),
  validateSDate: body("startDate")
    .isDate()
    .withMessage("من فضلك ادخل تاريخ صحيح"),
  validateEDate: body("endDate")
    .isDate()
    .withMessage("من فضلك ادخل تاريخ صحيح"),
  validateMealsNumber: body("numberOfMeals")
    .isNumeric()
    .isInt()
    .withMessage("عدد الوجبات يجب ان تكون رقم صحيح"),
  validatePrice: body("subscriptionPrice")
    .isNumeric()
    .isInt()
    .isFloat()
    .toFloat()
    .withMessage("يجب ان يكون رقم صحيح او له منازل عشريه"),
};

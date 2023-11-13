const productAttributes = [
  "id",
  "userId",
  "title",
  "content",
  "status",
  "createdAt",
  "updatedAt"
];

const Status = {
  SELLING: "판매 중",
  SOLD: "판매 완료"
};

const ERR_MISSING_EMAIL = "이메일 입력이 필요합니다.";
const ERR_ALREADY_REGISTERED = "이미 가입 된 이메일입니다.";
const ERR_PASSWORD_MISMATCH = "비밀번호가 일치하지 않습니다.";
const MSG_SIGNUP_SUCCESS = "회원가입에 성공했습니다.";

const ERR_INVALID_DATA = "데이터 형식이 올바르지 않습니다.";
const ERR_INVALID_STATUS = "상태 값이 잘못되었습니다.";

const MSG_PRODUCT_CREATED = "판매 상품을 등록하였습니다.";
const MSG_PRODUCT_UPDATED = "상품을 수정하였습니다.";
const MSG_PRODUCT_DELETED = "상품을 삭제하였습니다.";

const ERR_USER_NOT_FOUND = "해당 이메일을 가진 사용자를 찾을 수 없습니다.";
const ERR_INVALID_PASSWORD = "비밀번호가 일치하지 않습니다.";
const MSG_LOGIN_SUCCESS = "로그인에 성공했습니다.";

module.exports = {
  productAttributes,
  Status,
  ERR_INVALID_DATA,
  ERR_INVALID_STATUS,
  MSG_PRODUCT_CREATED,
  MSG_PRODUCT_UPDATED,
  MSG_PRODUCT_DELETED,
  ERR_MISSING_EMAIL,
  ERR_ALREADY_REGISTERED,
  ERR_PASSWORD_MISMATCH,
  MSG_SIGNUP_SUCCESS,
  ERR_USER_NOT_FOUND,
  ERR_INVALID_PASSWORD,
  MSG_LOGIN_SUCCESS
};

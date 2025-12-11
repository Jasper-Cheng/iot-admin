import { createError, defineEventHandler, readBody, setResponseStatus } from 'h3';
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from '~/utils/cookie-utils';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';

export default defineEventHandler(async (event) => {
  const { password, username } = await readBody(event);
  if (!password || !username) {
    setResponseStatus(event, 400);
    throw createError({
      statusCode: 400,
      message: 'Username and password are required',
    });
  }

  const findUser = MOCK_USERS.find(
    (item) => item.username === username && item.password === password,
  );

  if (!findUser) {
    clearRefreshTokenCookie(event);
    setResponseStatus(event, 403);
    throw createError({
      statusCode: 403,
      message: 'Username or password is incorrect.',
    });
  }

  const accessToken = generateAccessToken(findUser);
  const refreshToken = generateRefreshToken(findUser);

  setRefreshTokenCookie(event, refreshToken);

  // 直接返回数据，不使用包装格式
  return {
    accessToken,
  };
});

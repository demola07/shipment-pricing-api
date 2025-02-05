import HttpCode from "./codes.js";

class Response {
  constructor(_instance, code, state, message, data) {
    this._instance = _instance;
    this.code = code;
    this.message = message;
    this.data = data;
    this.isSuccessful = state;
  }

  static success(instance, message, data = null, status = true) {
    return new Response(
      instance,
      HttpCode.SUCCESS,
      status,
      message,
      data
    )._send();
  }

  static created(instance, message, data = null) {
    return new Response(
      instance,
      HttpCode.CREATED,
      true,
      message,
      data
    )._send();
  }

  static notFound(instance, message, data = null) {
    return new Response(
      instance,
      HttpCode.NOT_FOUND,
      false,
      message,
      data
    )._send();
  }

  static gone(instance, message, data = null) {
    return new Response(
      instance,
      HttpCode.GONE,
      true,
      message,
      data
    )._send();
  }

  static internalServerError(instance, message, data = null) {
    return new Response(
      instance,
      HttpCode.INTERNAL_SERVER_ERROR,
      false,
      message,
      data
    )._send();
  }

  static unauthorized(instance, message, data = null) {
    return new Response(
      instance,
      HttpCode.UNAUTHORIZED,
      false,
      message,
      data
    )._send();
  }

  static forbidden(instance, message, data = null) {
    return new Response(
      instance,
      HttpCode.FORBIDDEN,
      false,
      message,
      data
    )._send();
  }

  static badRequest(instance, message, data = null) {
    return new Response(
      instance,
      HttpCode.BAD_REQUEST,
      false,
      message,
      data
    )._send();
  }

  _send() {
    return this._instance.status(this.code).json({
      message: this.message,
      data: this.data,
      success: this.isSuccessful,
    });
  }
}

export default Response; 
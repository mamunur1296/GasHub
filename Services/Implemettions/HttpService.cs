using System.Net.Http.Headers;
using System.Text;
using GasHub.Dtos;
using GasHub.Services.Interface;
using Newtonsoft.Json;


namespace GasHub.Services.Implemettions
{
    public class HttpService : IHttpService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ITokenService _tokenService;

        public HttpService(IHttpClientFactory httpClientFactory, ITokenService tokenService)
        {
            _httpClientFactory = httpClientFactory;
            _tokenService = tokenService;
        }

        public async Task<string> SendData(ClientRequest requestData, bool token = true)
        {
            try
            {
                using HttpClient httpClient = _httpClientFactory.CreateClient("BaseUrl");
                using HttpRequestMessage request = CreateHttpRequestMessage(requestData, token);

                HttpResponseMessage response = await httpClient.SendAsync(request);
                string responseBody = await response.Content.ReadAsStringAsync();

                //if (!response.IsSuccessStatusCode)
                //{
                //    // Log the error details (this should be replaced with an actual logging mechanism)
                //    return $"Error: {response.ReasonPhrase}, Content: {responseBody}";
                //}

                return responseBody;
            }
            catch (HttpRequestException httpEx)
            {
                // Handle specific HTTP request exceptions
                return $"HttpRequestException: {httpEx.Message}";
            }
            catch (TaskCanceledException timeoutEx)
            {
                // Handle request timeout

                return $"Request timeout: {timeoutEx.Message}";
            }
            catch (Exception ex)
            {
                // Handle any other exceptions
                return $"An error occurred while sending the data: {ex.Message}";
            }
        }

        private HttpRequestMessage CreateHttpRequestMessage(ClientRequest requestData, bool token)
        {
            var request = new HttpRequestMessage
            {
                RequestUri = new Uri(requestData.Url),
                Method = requestData.ApiType switch
                {
                    ApiType.Get => HttpMethod.Get,
                    ApiType.Post => HttpMethod.Post,
                    ApiType.Put => HttpMethod.Put,
                    ApiType.Delete => HttpMethod.Delete,
                    _ => HttpMethod.Get
                }
            };

            if (token)
            {
                var Token = _tokenService.GetToken();
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Token);
            }

            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(
                requestData.ContentType == ContentType.MultipartFormData ? "*/*" : "application/json"));

            if (requestData.ContentType == ContentType.MultipartFormData)
            {
                request.Content = CreateMultipartFormDataContent(requestData.Data);
            }
            else
            {
                var json = JsonConvert.SerializeObject(requestData.Data);
                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
            }

            return request;
        }

        private HttpContent CreateMultipartFormDataContent(object data)
        {
            var content = new MultipartFormDataContent();

            foreach (var property in data.GetType().GetProperties())
            {
                var value = property.GetValue(data);

                if (value is FormFile file && file != null)
                {
                    var fileContent = new StreamContent(file.OpenReadStream())
                    {
                        Headers =
                        {
                            ContentDisposition = new ContentDispositionHeaderValue("form-data")
                            {
                                Name = property.Name,
                                FileName = file.FileName
                            }
                        }
                    };
                    content.Add(fileContent);
                }
                else
                {
                    content.Add(new StringContent(value?.ToString() ?? string.Empty), property.Name);
                }
            }

            return content;
        }
    }
}








































//using System.Net.Http.Headers;
//using System.Text;
//using Newtonsoft.Json;
//using UserInterface.Application.DTOs;
//using UserInterface.Application.Services.Interface;

//namespace UserInterface.Application.Services.Implementations
//{
//    public class HttpService : IHttpService
//    {
//        private readonly IHttpClientFactory _httpClientFactory;


//        public HttpService(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<ResponseDto> SendData(ClientRequest requestData, bool token = true)
//        {
//            try
//            {
//                HttpClient httpClient = _httpClientFactory.CreateClient("BaseUrl");
//                HttpRequestMessage request = new HttpRequestMessage
//                {
//                    RequestUri = new Uri(requestData.Url),
//                    Method = requestData.ApiType switch
//                    {
//                        ApiType.Get => HttpMethod.Get,
//                        ApiType.Post => HttpMethod.Post,
//                        ApiType.Put => HttpMethod.Put,
//                        ApiType.Delete => HttpMethod.Delete,
//                        _ => HttpMethod.Get
//                    }
//                };

//                // Add headers
//                if (token)
//                {
//                    var Token = "";
//                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", Token);
//                }

//                if (requestData.ContentType == ContentType.MultipartFormData)
//                {
//                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("*/*"));
//                    var content = new MultipartFormDataContent();
//                    foreach (var item in requestData.Data.GetType().GetProperties())
//                    {
//                        var value = item.GetValue(requestData.Data);
//                        if (value is FormFile file)
//                        {
//                            if (file != null)
//                            {
//                                var fileContent = new StreamContent(file.OpenReadStream());
//                                fileContent.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
//                                {
//                                    Name = item.Name,
//                                    FileName = file.FileName
//                                };
//                                content.Add(fileContent);
//                            }
//                        }
//                        else
//                        {
//                            content.Add(new StringContent(value?.ToString() ?? string.Empty), item.Name);
//                        }
//                    }
//                    request.Content = content;
//                }
//                else
//                {
//                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
//                    var json = JsonConvert.SerializeObject(requestData.Data);
//                    request.Content = new StringContent(json, Encoding.UTF8, "application/json");
//                }

//                // Send the request
//                HttpResponseMessage response = await httpClient.SendAsync(request);

//                var responseContent = await response.Content.ReadAsStringAsync();
//                // Handle the response
//                if (!response.IsSuccessStatusCode)
//                {
//                    var errorContent = await response.Content.ReadAsStringAsync();
//                    return new ResponseDto
//                    {
//                        isSuccess = false,
//                        Message = $"Error: {response.ReasonPhrase}, Content: {errorContent}"
//                    };
//                }


//                var responseData = JsonConvert.DeserializeObject<object>(responseContent);

//                // Ensure responseDto is not null
//                if (responseData == null)
//                {
//                    return new ResponseDto
//                    {
//                        isSuccess = false,
//                        Message = "Error: Unable to deserialize response content."
//                    };
//                }

//                return new ResponseDto 
//                { 
//                    isSuccess = true,
//                    Result= responseData,
//                    Status = (int)response.StatusCode,
//                };
//            }
//            catch (Exception ex)
//            {
//                // Log the exception or handle it as needed
//                return new ResponseDto
//                {
//                    isSuccess = false,
//                    Message = $"An error occurred while sending the data: {ex.Message}"
//                };
//            }
//        }
//    }
//}




//namespace UserInterface.Application.Services.Implementations
//{
//    public class HttpService : IHttpService
//    {
//        private readonly IHttpClientFactory _httpClientFactory;

//        public HttpService(IHttpClientFactory httpClientFactory)
//        {
//            _httpClientFactory = httpClientFactory;
//        }

//        public async Task<ResponseDto> SendData(ClientRequest requestData, bool token = true)
//        {
//            try
//            {
//                using HttpClient httpClient = _httpClientFactory.CreateClient("BaseUrl");
//                using HttpRequestMessage request = CreateHttpRequestMessage(requestData, token);

//                HttpResponseMessage response = await httpClient.SendAsync(request);
//                string responseContent = await response.Content.ReadAsStringAsync();

//                if (!response.IsSuccessStatusCode)
//                {
//                    return new ResponseDto
//                    {
//                        isSuccess = false,
//                        Message = $"Error: {response.ReasonPhrase}, Content: {responseContent}"
//                    };
//                }

//                var responseDto = JsonConvert.DeserializeObject<ResponseDto>(responseContent);

//                if (responseDto == null)
//                {
//                    return new ResponseDto
//                    {
//                        isSuccess = false,
//                        Message = "Error: Unable to deserialize response content."
//                    };
//                }

//                return responseDto;
//            }
//            catch (Exception ex)
//            {
//                // Ideally, log the exception here
//                return new ResponseDto
//                {
//                    isSuccess = false,
//                    Message = $"An error occurred while sending the data: {ex.Message}"
//                };
//            }
//        }

//        private HttpRequestMessage CreateHttpRequestMessage(ClientRequest requestData, bool token)
//        {
//            var request = new HttpRequestMessage
//            {
//                RequestUri = new Uri(requestData.Url),
//                Method = requestData.ApiType switch
//                {
//                    ApiType.Get => HttpMethod.Get,
//                    ApiType.Post => HttpMethod.Post,
//                    ApiType.Put => HttpMethod.Put,
//                    ApiType.Delete => HttpMethod.Delete,
//                    _ => HttpMethod.Get
//                }
//            };

//            if (token && !string.IsNullOrEmpty(requestData.AccessToken))
//            {
//                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", requestData.AccessToken);
//            }

//            request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue(
//                requestData.ContentType == ContentType.MultipartFormData ? "*/*" : "application/json"));

//            if (requestData.ContentType == ContentType.MultipartFormData)
//            {
//                request.Content = CreateMultipartFormDataContent(requestData.Data);
//            }
//            else
//            {
//                var json = JsonConvert.SerializeObject(requestData.Data);
//                request.Content = new StringContent(json, Encoding.UTF8, "application/json");
//            }

//            return request;
//        }

//        private HttpContent CreateMultipartFormDataContent(object data)
//        {
//            var content = new MultipartFormDataContent();

//            foreach (var property in data.GetType().GetProperties())
//            {
//                var value = property.GetValue(data);

//                if (value is FormFile file && file != null)
//                {
//                    var fileContent = new StreamContent(file.OpenReadStream())
//                    {
//                        Headers =
//                        {
//                            ContentDisposition = new ContentDispositionHeaderValue("form-data")
//                            {
//                                Name = property.Name,
//                                FileName = file.FileName
//                            }
//                        }
//                    };
//                    content.Add(fileContent);
//                }
//                else
//                {
//                    content.Add(new StringContent(value?.ToString() ?? string.Empty), property.Name);
//                }
//            }

//            return content;
//        }
//    }
//}

package kr.co.influential.youngkangapp.common;

import kr.co.influential.youngkangapp.BuildConfig;

public enum Gateway {
//  DEBUG("https://", "api-elb", "demo", "welaaa.com"),
  DEBUG("https://", "api-dev", "demo", "welaaa.com"),
  RELEASE("https://", "api-dev", "demo", "welaaa.com");

  String protocol;
  String apiHost;
  String webHost;
  String domain;

  Gateway(String protocol, String apiHost, String webHost, String domain) {
    this.protocol = protocol;
    this.apiHost = apiHost;
    this.webHost = webHost;
    this.domain = domain;
  }

  public static Gateway get() {
    return valueOf(BuildConfig.BUILD_TYPE.toUpperCase());
  }

  public String getProtocol() {
    return protocol;
  }

  public String getApiHost() {
    return apiHost;
  }

  public String getWebHost() {
    return webHost;
  }

  public String getDomain() {
    return domain;
  }
}

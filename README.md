![Screenshot](/assets/images/v2/demo.webp)

# McbeRank

🏆 Minecraft BE 서버들의 순위를 보여주는 사이트입니다.

<br>

# 설치

McbeRank를 구동하려면 **[MongoDB](https://www.mongodb.com/)**, **[InfluxDB](https://www.influxdata.com/)** 가 설치되어 있어야 합니다.

설치 환경에 영향을 받지 않는 Docker를 사용한 설치를 권장합니다.

<br>

## 🛠 Docker를 사용하여 설치하기 (권장)

[Docker를 사용한 McbeRank 설치 가이드](https://github.com/McbeRank/McbeRank-Docker/blob/master/README.md)

<br>

## 🛠 로컬에 설치하기

진행하기 전, NodeJS, MongoDB, InfluxDB가 설치되어 있어야 합니다.

### 1. 소스 코드 다운로드
```bash
/$ cd ~ # 홈 디렉터리에서 작업합니다. 원하신다면 다른 곳에서 진행하여도 됩니다.
~$ git clone https://github.com/McbeRank/McbeRank
~$ git clone https://github.com/McbeRank/McbeRank-Vue
```

### 2. Vue-CLI 빌드
```bash
~$ cd McbeRank-Vue
~/McbeRank-Vue$ npm install
~/McbeRank-Vue$ npm run build
```

### 3. 빌드한 파일들을 McbeRank의 public폴더로 복사
```bash
~/McbeRank-Vue$ mkdir ../McbeRank/public/ # public 폴더 생성
~/McbeRank-Vue$ cp -rf dist/* ../McbeRank/public/ # 빌드된 파일을 public 폴더로 복사
```

### 4. 의존성 설치
```bash
~/McbeRank-Vue$ cd ../McbeRank
~/McbeRank$ npm install
```

### 5. 실행
```bash
~/McbeRank$ npm run start
```

<br>

# 설정

## `config.ini` 및 환경변수

McbeRank는 `config` 폴더의 `config.ini` 또는 환경변수를 사용하여 설정할 수 있으며 `config.ini` 의 설정보다 우선됩니다.

환경변수를 설정하려면 아래와 같은 형식으로 정의하면 됩니다.
```bash
MCBERANK_<섹션>_<항목>=값
```

예로, 다음의 `config.ini` 는
```ini
[server]
port = 3500

[subdomain]
enable = true
subdomain = mcberank
```
아래의 환경변수로 치환할 수 있습니다.
```bash
MCBERANK_SERVER_PORT=3500
MCBERANK_SUBDOMAIN_ENABLE=true
MCBERANK_SUBDOMAIN_SUBDOMAIN=mcberank
```

<br>

## 설정 가능한 항목

### [server]

|항목|기본값|설명|
|-|-|-|
|bind|`0.0.0.0`|서버가 바인드 할 주소입니다.|
|port|`3500`|서버가 사용할 포트입니다.|

<br>

### [subdomain]

서브 도메인 관련 설정입니다. Reverse Proxy 구성을 하기 위해 사용될 수 있습니다.
활성화 시 `http://host:port/subdomain/`와 같이 하위 디렉토리에서 호스트합니다.

|항목|기본값|설명|
|-|-|-|
|enable|`false`|서브 도메인 활성화 여부입니다. `true` 로 설정 시 활성화됩니다.|
|subdomain|`mcberank`|설정된 이름의 하위 디렉토리에서 호스트됩니다.|

<br>

### [mongodb]

MongoDB 연동 설정입니다.

|항목|기본값|설명|
|-|-|-|
|host|`127.0.0.1:27017`|연결할 MongoDB 주소입니다.|
|database|`mcberank`|MongoDB 내부에서 사용할 database 이름입니다.|
|username|`admin`|MongoDB에 로그인할 사용자 이름입니다.|
|password|`admin`|MongoDB에 로그인할 때 사용할 패스워드입니다.|

<br>

### [influxdb]

InfluxDB 연동 설정입니다.

|항목|기본값|설명|
|-|-|-|
|host|`127.0.0.1:8086`|연결할 InfluxDB 주소입니다.|
|database|`mcberank`|InfluxDB 내부에서 사용할 database 이름입니다.|
|username|`admin`|InfluxDB에 로그인할 사용자 이름입니다.|
|password|`admin`|InfluxDB에 로그인할 때 사용할 패스워드입니다.|
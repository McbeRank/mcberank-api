# McbeRank

Minecraft PE 서버들의 순위를 보여주는 사이트입니다.

<br>

## 설치 방법

### 1. NodeJS 설치
McbeRank 사이트를 구동하기 위해선 NodeJS가 필히 설치되어 있어야 합니다.

<br>

* **Windows**
https://nodejs.org 에서 윈도우용 런타임을 다운받은 후 설치해주세요.

<br>

* **Ubuntu**
```bash
# NodeJS를 설치하기 위해 필요한 패키지 설치
sudo apt-get -y install g++ curl libssl-dev git-core make

# 9.x 버전 다운로드
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash –

# apt-get 으로 NodeJS 설치
sudo apt-get -y install nodejs
```

<br>

* **CentOS**
```bash
# NodeJS를 설치하기 위해 필요한 패키지 설치
sudo yum install -y g++ curl libssl-dev git-core make

# 9.x 버전 다운로드
curl –silent –location https://rpm.nodesource.com/setup_8.x | sudo bash –

# yum 으로 NodeJS 설치
sudo yum install -y nodejs
```

<br>

### 2. 소스 다운로드
```bash
git clone --recursive git://github.com/McbeRank/McbeRank.git
```

<br>

### 3. NPM 모듈(의존성) 설치
```bash
npm install
```

<br>

### 4. addresses.json 에 서버 추가하기
`public/data/` 경로에 `addresses.json` 파일 생성 후, 아래와 같이 서버를 추가해주세요

```json
[
	{
		"host": "play.example.com",
		"port": 19132
	},
	{
		"host": "game.example2.kr",
		"port": 10031
	}
]
```

<br>

### 5. 실행하기
```bash
sudo node app.js
```
# 06. AWS 자동화 개요

Ansible로 AWS를 다루는 방식은 크게 두 가지입니다.

1) **AWS API 호출(컨트롤 노드에서 실행)**
   - `connection: local`
   - amazon.aws, community.aws 컬렉션 사용
   - 예: VPC 생성, EC2 생성, S3 버킷 생성

2) **EC2 인스턴스에 SSH 접속해서 설정(타겟에서 실행)**
   - 동적 인벤토리로 EC2 목록을 가져온 뒤
   - OS 패키지 설치/서비스 설정 등을 적용

이 레포는 1)과 2)를 모두 경험하도록 구성되어 있습니다.

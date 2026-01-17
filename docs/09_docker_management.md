# 09. Docker 관리 자동화

## 목표
- 원격 리눅스 서버에 Docker Engine 설치
- 이미지 Pull / 컨테이너 생성 / 포트 노출

## 설치 플레이북
- `playbooks/10_docker_install.yml`

## 컨테이너 실행 플레이북
- `playbooks/11_docker_run_nginx.yml`

## 실행
```bash
# inventories/docker/hosts.ini에 docker 호스트를 추가한 뒤
ansible-playbook -i inventories/docker/hosts.ini playbooks/10_docker_install.yml
ansible-playbook -i inventories/docker/hosts.ini playbooks/11_docker_run_nginx.yml
```

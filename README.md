# Ansible

## VSCode + WSL 설정 (캡처 순서)

1) **VSCode에서 WSL 확장 확인**

![VSCode WSL 확장](image.png)

2) **WSL 연결 또는 Linux 설치**

![WSL 연결](image-1.png)

3) **WSL 배포판 연결/해제 확인**

![WSL 배포판](image-2.png)

4) **Windows 프로젝트 폴더를 WSL로 복제 후 VSCode 열기**

![폴더 열기](image-3.png)

5) **WSL 환경에서 Git 사용자 정보 재설정**

![Git 설정](image-4.png)

```bash
git config --global user.name "당신의 이름 또는 닉네임"
git config --global user.email "github에 등록된 이메일@example.com"
```

---

## 환경 준비

- Linux/WSL(권장), 또는 macOS
- Python 3.9+
- Ansible (ansible-core)
- AWS 자격증명(Access Key / Secret Key 또는 SSO/프로파일)

## 설치

```bash
./scripts/bootstrap.sh
./scripts/check.sh
```

### 권한 문제 발생 시

```bash
chmod +x scripts/bootstrap.sh
./scripts/bootstrap.sh
```

### PEP 668 정책(Externally Managed Environment) 대응

Ubuntu/Debian이 시스템 Python에 pip 전역 설치를 막는 환경(23.10+/24.04, Python 3.12 등)에서는 venv 사용을 권장합니다.

```bash
sudo apt update
sudo apt install -y python3-venv python3-pip python3-full

python3 -m venv .venv
source .venv/bin/activate

python -m pip install -U pip setuptools wheel
python -m pip install "ansible>=9" ansible-lint molecule "molecule-plugins[docker]" docker
ansible-galaxy collection install -r requirements.yml
```

### 설치 확인

```bash
ansible --version
ansible-galaxy collection list | head -n 5
```

---

## 로컬에서 플레이북 실행 확인

```bash
source .venv/bin/activate
ansible -i inventories/dev/hosts.ini all -m ping
```

```bash
ansible-playbook -i inventories/dev/hosts.ini playbooks/00_ping.yml
```

### 콜백 플러그인 오류 해결 (ansible-core 2.13+)

```bash
sed -i 's/^stdout_callback *= *community\.general\.yaml/stdout_callback = ansible.builtin.default/' ansible.cfg
grep -q '^result_format' ansible.cfg || printf '\nresult_format = yaml\n' >> ansible.cfg
```

---

## Ansible 학습용 단계별 플레이북

아래 학습용 플레이북들은 **로컬 환경**에서 실행 가능한 예제입니다.

| 단계 | 파일 | 학습 포인트 | 실행 예시 |
| --- | --- | --- | --- |
| 01 | `playbooks/learning/01_ping.yml` | 가장 기본적인 Ping 모듈 | `ansible-playbook -i inventories/local/hosts.ini playbooks/learning/01_ping.yml` |
| 02 | `playbooks/learning/02_vars.yml` | 변수/팩트/`set_fact` | `ansible-playbook -i inventories/local/hosts.ini playbooks/learning/02_vars.yml` |
| 03 | `playbooks/learning/03_loop_when.yml` | loop + when 조건 | `ansible-playbook -i inventories/local/hosts.ini playbooks/learning/03_loop_when.yml` |
| 04 | `playbooks/learning/04_template_handler.yml` | template + handler | `ansible-playbook -i inventories/local/hosts.ini playbooks/learning/04_template_handler.yml` |

> 결과 파일은 `/tmp/ansible-learning`에 생성됩니다.

---

## 기본 테스트

```bash
ansible -i inventories/local/hosts.ini local -m ping
ansible-playbook playbooks/00_ping.yml
```

## 참고 사항

1. `docs/01_basics.md` : Ansible가 무엇이고, ad-hoc 명령/모듈 실행
2. `docs/02_inventory_vars.md` : 인벤토리/변수/팩트/조건문
3. `docs/03_playbooks_roles.md` : 플레이북 구조, Role로 분리
4. `docs/04_templates_handlers.md` : Jinja2 템플릿, 핸들러, idempotent 개념
5. `docs/05_vault_secrets.md` : Vault로 시크릿 관리

### 등등 docs 폴더 참조

---

## Nginx 설치 (로컬)

```bash
ansible-playbook -i inventories/local/hosts.ini playbooks/02_nginx.yml
```

권한 문제가 있으면 아래처럼 실행하세요.

```bash
ansible-playbook -i inventories/local/hosts.ini playbooks/02_nginx.yml --become --ask-become-pass
```

### Role 기반 웹서버 배포

```bash
ansible-playbook -i inventories/local/hosts.ini playbooks/03_role_web.yml
```

### Docker 호스트에 엔진 설치

```bash
ansible-playbook -i inventories/docker/hosts.ini playbooks/10_docker_install.yml
```

### AWS VPC + EC2 만들기

```bash
# AWS 자격 증명은 환경변수 또는 ~/.aws/credentials(프로파일)로 설정
ansible-playbook playbooks/20_aws_create_vpc.yml -e aws_region=ap-northeast-2
ansible-playbook playbooks/21_aws_create_ec2.yml -e aws_region=ap-northeast-2
```

> 비용이 발생할 수 있으니, 실습 후 `playbooks/23_aws_cleanup.yml`로 정리하세요.

## Docker 엔진 설치 → Compose 배포

```bash
ansible-playbook -i inventories/dev/hosts.ini playbooks/10_docker_engine_install.yml
```

비밀번호 입력 문제가 있으면 아래처럼 실행합니다.

```bash
ansible-playbook -i inventories/dev/hosts.ini playbooks/10_docker_engine_install.yml -K
```

```bash
ansible-playbook -i inventories/dev/hosts.ini playbooks/11_deploy_stack.yml
```

## Rolling 배포(멀티 호스트)

```bash
ansible-playbook -i inventories/prod/hosts.ini playbooks/12_deploy_stack_rolling.yml
```

## Blue-Green 배포(단일 호스트)

```bash
ansible-playbook -i inventories/dev/hosts.ini playbooks/13_blue_green_switch.yml
```

## AWS (SSM 기반, SSH 없이)

- 문서: `docs/06_ssm_connection.md`

원샷 프로비저닝(EC2 생성 + SSM 역할/프로파일 + 태그):

```bash
ansible-playbook playbooks/20_aws_provision_ssm_no_ssh.yml \
  -e aws_region=ap-northeast-2 \
  -e environment=dev

ansible-inventory -i inventories/aws/aws_ec2.yml --graph
```

SSM로 구성/배포(SSH 없이):

```bash
ansible-playbook -i inventories/aws/aws_ec2.yml playbooks/21_post_provision_via_ssm.yml
```

정리(비용 방지):

```bash
ansible-playbook playbooks/23_aws_cleanup.yml -e aws_region=ap-northeast-2 -e environment=dev
```

---

자세한 단계별 가이드는 `docs/`를 참고하세요.
